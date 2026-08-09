import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, desc } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../database/database.module';
import { resumes, tailoredResumes } from '../database/schema';
import type { InferSelectModel } from 'drizzle-orm';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import OpenAI from 'openai';

export type TailoredResumeRecord = InferSelectModel<typeof tailoredResumes>;

export interface BulletDiffItem {
  id: string;
  company: string;
  role: string;
  originalText: string;
  tailoredText: string;
  addedPhrase?: string;
  matchedKeywords: string[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface AnalyzeJobParams {
  userId: string;
  masterResumeId?: string;
  targetRole: string;
  targetCompany: string;
  jobDescription: string;
}

export interface UpdateTailorParams {
  id: string;
  userId: string;
  targetRole?: string;
  targetCompany?: string;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  bulletDiffs?: BulletDiffItem[];
}

export interface ParsedWorkExperience {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  location?: string;
  bullets?: string[];
}

export interface ParsedEducation {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  gpa?: string;
}

export interface ParsedProject {
  title?: string;
  description?: string;
  technologies?: string[];
  url?: string;
}

export interface ParsedCommunityContribution {
  organization?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  url?: string;
}

export interface ParsedCertification {
  name?: string;
  issuer?: string;
  issueDate?: string;
}

export interface ParsedLanguage {
  language?: string;
  fluency?: string;
}

export interface ParsedPublication {
  title?: string;
  publisher?: string;
  publicationDate?: string;
  url?: string;
  description?: string;
}

export interface ParsedHonorAndAward {
  title?: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface ParsedResumeGraphData {
  contactInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  summary?: string;
  workExperiences?: ParsedWorkExperience[];
  education?: ParsedEducation[];
  skills?: string[];
  projects?: ParsedProject[];
  communityContributions?: ParsedCommunityContribution[];
  certifications?: ParsedCertification[];
  languages?: ParsedLanguage[];
  publications?: ParsedPublication[];
  honorsAndAwards?: ParsedHonorAndAward[];
}

@Injectable()
export class TailorService {
  private openai: OpenAI | null = null;

  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NodePgDatabase<typeof import('../database/schema')>,
  ) {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  async analyzeAndTailor(
    params: AnalyzeJobParams,
  ): Promise<TailoredResumeRecord> {
    let masterResumeRecord = null;
    if (params.masterResumeId) {
      const found = await this.db
        .select()
        .from(resumes)
        .where(
          and(
            eq(resumes.id, params.masterResumeId),
            eq(resumes.userId, params.userId),
          ),
        );
      if (found.length > 0) {
        masterResumeRecord = found[0];
      }
    }

    if (!masterResumeRecord) {
      const userResumes = await this.db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, params.userId))
        .orderBy(desc(resumes.createdAt));
      if (userResumes.length > 0) {
        masterResumeRecord = userResumes[0];
      }
    }

    const parsedGraph =
      (masterResumeRecord?.parsedData as ParsedResumeGraphData | null) || null;

    const {
      targetRole: resolvedRole,
      targetCompany: resolvedCompany,
      matchedKeywords,
      missingKeywords,
      bulletDiffs,
    } = await this.processTailoringWithLLM(
      params.targetRole,
      params.targetCompany,
      params.jobDescription,
      parsedGraph,
    );

    const isGenericRole =
      !params.targetRole ||
      params.targetRole.trim() === '' ||
      params.targetRole.trim().toLowerCase() === 'target role' ||
      params.targetRole.trim().toLowerCase() === 'senior full-stack engineer';

    const isGenericCompany =
      !params.targetCompany ||
      params.targetCompany.trim() === '' ||
      params.targetCompany.trim().toLowerCase() === 'target company' ||
      params.targetCompany.trim().toLowerCase() === 'xeux labs';

    const finalTargetRole =
      isGenericRole && resolvedRole
        ? resolvedRole
        : params.targetRole.trim() || resolvedRole || 'Target Position';

    const finalTargetCompany =
      isGenericCompany && resolvedCompany
        ? resolvedCompany
        : params.targetCompany.trim() ||
          resolvedCompany ||
          'Target Organization';

    const inserted = await this.db
      .insert(tailoredResumes)
      .values({
        userId: params.userId,
        masterResumeId: masterResumeRecord?.id || null,
        targetRole: finalTargetRole,
        targetCompany: finalTargetCompany,
        jobDescription: params.jobDescription,
        matchedKeywords,
        missingKeywords,
        bulletDiffs,
      })
      .returning();

    return inserted[0];
  }

  async evaluateAtsCheck(
    id: string,
    userId: string,
  ): Promise<TailoredResumeRecord> {
    const record = await this.findByIdForUser(id, userId);

    if (!this.openai) {
      throw new BadRequestException(
        'OpenAI API key missing on server for ATS check.',
      );
    }

    let masterResumeRecord = null;
    if (record.masterResumeId) {
      const found = await this.db
        .select()
        .from(resumes)
        .where(
          and(
            eq(resumes.id, record.masterResumeId),
            eq(resumes.userId, userId),
          ),
        );
      if (found.length > 0) {
        masterResumeRecord = found[0];
      }
    }

    const parsedGraph =
      (masterResumeRecord?.parsedData as ParsedResumeGraphData | null) || null;

    const existingDiffs = (Array.isArray(record.bulletDiffs)
      ? record.bulletDiffs
      : []) as unknown as BulletDiffItem[];
    const existingMatched = (
      Array.isArray(record.matchedKeywords) ? record.matchedKeywords : []
    ) as string[];
    const existingMissing = (
      Array.isArray(record.missingKeywords) ? record.missingKeywords : []
    ) as string[];

    const acceptedMap = new Map(
      existingDiffs
        .filter((d) => d.status === 'accepted')
        .map((d) => [d.originalText, d.tailoredText]),
    );

    const { matchedKeywords, missingKeywords, bulletDiffs } =
      await this.processTailoringWithLLM(
        record.targetRole,
        record.targetCompany,
        record.jobDescription,
        parsedGraph,
        acceptedMap,
      );

    const finalDiffs: BulletDiffItem[] = [];

    for (const oldD of existingDiffs) {
      if (oldD.status === 'accepted') {
        finalDiffs.push(oldD);
      } else {
        const newMatch = bulletDiffs.find(
          (n) => n.id === oldD.id || n.originalText === oldD.originalText,
        );
        if (newMatch) {
          finalDiffs.push(newMatch);
        } else {
          finalDiffs.push(oldD);
        }
      }
    }

    for (const newD of bulletDiffs) {
      const exists = finalDiffs.some(
        (fd) => fd.id === newD.id || fd.originalText === newD.originalText,
      );
      if (!exists) {
        finalDiffs.push(newD);
      }
    }

    const finalMatched = Array.from(
      new Set([...existingMatched, ...matchedKeywords]),
    );
    const finalMissing = Array.from(
      new Set(
        [...existingMissing, ...missingKeywords].filter(
          (k) => !finalMatched.includes(k),
        ),
      ),
    );

    const updated = await this.db
      .update(tailoredResumes)
      .set({
        matchedKeywords: finalMatched,
        missingKeywords: finalMissing,
        bulletDiffs: finalDiffs,
        updatedAt: new Date(),
      })
      .where(
        and(eq(tailoredResumes.id, id), eq(tailoredResumes.userId, userId)),
      )
      .returning();

    return updated[0];
  }

  async findHistoryForUser(userId: string): Promise<TailoredResumeRecord[]> {
    return this.db
      .select()
      .from(tailoredResumes)
      .where(eq(tailoredResumes.userId, userId))
      .orderBy(desc(tailoredResumes.createdAt));
  }

  async findByIdForUser(
    id: string,
    userId: string,
  ): Promise<TailoredResumeRecord> {
    const records = await this.db
      .select()
      .from(tailoredResumes)
      .where(
        and(eq(tailoredResumes.id, id), eq(tailoredResumes.userId, userId)),
      );

    if (records.length === 0) {
      throw new NotFoundException(`Tailoring record with ID ${id} not found`);
    }
    return records[0];
  }

  async updateTailoredRecord(
    params: UpdateTailorParams,
  ): Promise<TailoredResumeRecord> {
    await this.findByIdForUser(params.id, params.userId);

    const updatePayload: Partial<TailoredResumeRecord> = {
      updatedAt: new Date(),
    };

    if (params.targetRole) {
      updatePayload.targetRole = params.targetRole;
    }
    if (params.targetCompany) {
      updatePayload.targetCompany = params.targetCompany;
    }
    if (params.matchedKeywords) {
      updatePayload.matchedKeywords = params.matchedKeywords;
    }
    if (params.missingKeywords) {
      updatePayload.missingKeywords = params.missingKeywords;
    }
    if (params.bulletDiffs) {
      updatePayload.bulletDiffs = params.bulletDiffs;
    }

    const updated = await this.db
      .update(tailoredResumes)
      .set(updatePayload)
      .where(
        and(
          eq(tailoredResumes.id, params.id),
          eq(tailoredResumes.userId, params.userId),
        ),
      )
      .returning();

    return updated[0];
  }

  async deleteTailoredRecord(
    id: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    await this.findByIdForUser(id, userId);
    await this.db
      .delete(tailoredResumes)
      .where(
        and(eq(tailoredResumes.id, id), eq(tailoredResumes.userId, userId)),
      );
    return { success: true };
  }

  async generateDocxExport(id: string, userId: string): Promise<Buffer> {
    const record = await this.findByIdForUser(id, userId);

    let masterResumeRecord = null;
    if (record.masterResumeId) {
      const found = await this.db
        .select()
        .from(resumes)
        .where(
          and(
            eq(resumes.id, record.masterResumeId),
            eq(resumes.userId, userId),
          ),
        );
      if (found.length > 0) {
        masterResumeRecord = found[0];
      }
    }

    if (!masterResumeRecord) {
      const userResumes = await this.db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, userId))
        .orderBy(desc(resumes.createdAt));
      if (userResumes.length > 0) {
        masterResumeRecord = userResumes[0];
      }
    }

    const graph =
      (masterResumeRecord?.parsedData as ParsedResumeGraphData | null) || null;
    const bulletDiffs = (Array.isArray(record.bulletDiffs)
      ? record.bulletDiffs
      : []) as unknown as BulletDiffItem[];

    const fullName = graph?.contactInfo?.fullName || 'Candidate Name';
    const email = graph?.contactInfo?.email || '';
    const location = graph?.contactInfo?.location || '';
    const phone = graph?.contactInfo?.phone || '';
    const portfolioUrl = graph?.contactInfo?.websiteUrl || '';
    const summary = graph?.summary || '';
    const skills =
      graph?.skills && graph.skills.length > 0
        ? graph.skills
        : ((Array.isArray(record.matchedKeywords)
            ? record.matchedKeywords
            : []) as string[]);

    const workExperiences = (graph?.workExperiences || []).map((exp) => {
      const comp = exp.company || record.targetCompany;
      const pos = exp.position || record.targetRole;
      const period = [
        exp.startDate,
        exp.endDate || (exp.isCurrent ? 'Present' : ''),
      ]
        .filter(Boolean)
        .join(' - ');

      const bullets = (exp.bullets || []).map((origBullet, bIdx) => {
        const match = bulletDiffs.find(
          (d) =>
            d.originalText === origBullet ||
            (d.company === comp &&
              d.role === pos &&
              d.id.endsWith(`-${bIdx + 1}`)),
        );
        if (match) {
          return match.status === 'rejected'
            ? match.originalText
            : match.tailoredText;
        }
        return origBullet;
      });

      return {
        company: comp,
        role: pos,
        period,
        bullets,
      };
    });

    const education = (graph?.education || []).map((edu) => ({
      degree:
        [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') ||
        edu.degree ||
        edu.institution ||
        'Degree',
      institution: edu.institution || '',
      period: [edu.startDate, edu.endDate].filter(Boolean).join(' - '),
    }));

    const projects = (graph?.projects || []).map((proj) => ({
      title: proj.title || 'Project',
      description: proj.description || '',
      technologies: (proj.technologies || []).join(' • '),
    }));

    const communityContributions = (graph?.communityContributions || []).map(
      (c) => ({
        role: c.role || '',
        organization: c.organization || '',
        period: [c.startDate, c.endDate || 'Present']
          .filter(Boolean)
          .join(' - '),
        description: c.description || '',
      }),
    );

    const certifications = (graph?.certifications || []).map((c) => ({
      name: c.name || 'Certification',
      issuer: c.issuer || '',
      issueDate: c.issueDate || '',
    }));

    const languages = (graph?.languages || []).map((l) => ({
      language: l.language || '',
      fluency: l.fluency || '',
    }));

    const publications = (graph?.publications || []).map((pub) => ({
      title: pub.title || '',
      publisher: pub.publisher || '',
      publicationDate: pub.publicationDate || '',
    }));

    const honorsAndAwards = (graph?.honorsAndAwards || []).map((award) => ({
      title: award.title || '',
      issuer: award.issuer || '',
      date: award.date || '',
    }));

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 720, bottom: 720, left: 720, right: 720 },
            },
          },
          children: [
            // Name Header
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: fullName.toUpperCase(),
                  bold: true,
                  size: 32,
                  font: 'Calibri',
                }),
              ],
            }),
            // Contact Subheader
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: [
                    record.targetRole,
                    location,
                    email,
                    phone,
                    portfolioUrl,
                  ]
                    .filter(Boolean)
                    .join(' | '),
                  size: 20,
                  font: 'Calibri',
                  color: '444444',
                }),
              ],
            }),
            // Executive Summary
            ...(summary
              ? [
                  this.createSectionHeading('EXECUTIVE SUMMARY'),
                  new Paragraph({
                    spacing: { after: 200 },
                    children: [
                      new TextRun({
                        text: summary,
                        size: 21,
                        font: 'Calibri',
                      }),
                    ],
                  }),
                ]
              : []),
            // Experience
            ...(workExperiences.length > 0
              ? [
                  this.createSectionHeading('WORK EXPERIENCE'),
                  ...workExperiences.flatMap((exp) => [
                    new Paragraph({
                      spacing: { before: 120, after: 40 },
                      children: [
                        new TextRun({
                          text: `${exp.company} `,
                          bold: true,
                          size: 22,
                          font: 'Calibri',
                        }),
                        new TextRun({
                          text: `- ${exp.role}`,
                          bold: true,
                          size: 22,
                          font: 'Calibri',
                        }),
                        ...(exp.period
                          ? [
                              new TextRun({
                                text: `\t${exp.period}`,
                                bold: true,
                                size: 20,
                                font: 'Calibri',
                              }),
                            ]
                          : []),
                      ],
                    }),
                    ...exp.bullets.map(
                      (bullet) =>
                        new Paragraph({
                          bullet: { level: 0 },
                          spacing: { after: 60 },
                          children: [
                            new TextRun({
                              text: bullet,
                              size: 20,
                              font: 'Calibri',
                            }),
                          ],
                        }),
                    ),
                  ]),
                ]
              : []),
            // Technical Skills
            ...(skills.length > 0
              ? [
                  this.createSectionHeading('TECHNICAL SKILLS'),
                  new Paragraph({
                    spacing: { after: 200 },
                    children: [
                      new TextRun({
                        text: skills.join(' • '),
                        size: 20,
                        font: 'Calibri',
                      }),
                    ],
                  }),
                ]
              : []),
            // Projects
            ...(projects.length > 0
              ? [
                  this.createSectionHeading('FEATURED PROJECTS'),
                  ...projects.flatMap((proj) => [
                    new Paragraph({
                      spacing: { before: 100, after: 40 },
                      children: [
                        new TextRun({
                          text: proj.title,
                          bold: true,
                          size: 21,
                          font: 'Calibri',
                        }),
                        ...(proj.technologies
                          ? [
                              new TextRun({
                                text: ` (${proj.technologies})`,
                                italics: true,
                                size: 19,
                                font: 'Calibri',
                              }),
                            ]
                          : []),
                      ],
                    }),
                    ...(proj.description
                      ? [
                          new Paragraph({
                            spacing: { after: 100 },
                            children: [
                              new TextRun({
                                text: proj.description,
                                size: 20,
                                font: 'Calibri',
                              }),
                            ],
                          }),
                        ]
                      : []),
                  ]),
                ]
              : []),
            // Education
            ...(education.length > 0
              ? [
                  this.createSectionHeading('EDUCATION'),
                  ...education.map(
                    (edu) =>
                      new Paragraph({
                        spacing: { after: 80 },
                        children: [
                          new TextRun({
                            text: `${edu.degree} `,
                            bold: true,
                            size: 21,
                            font: 'Calibri',
                          }),
                          ...(edu.institution
                            ? [
                                new TextRun({
                                  text: `- ${edu.institution}`,
                                  size: 21,
                                  font: 'Calibri',
                                }),
                              ]
                            : []),
                          ...(edu.period
                            ? [
                                new TextRun({
                                  text: ` (${edu.period})`,
                                  size: 20,
                                  font: 'Calibri',
                                  color: '555555',
                                }),
                              ]
                            : []),
                        ],
                      }),
                  ),
                ]
              : []),
            // Community Contributions
            ...(communityContributions.length > 0
              ? [
                  this.createSectionHeading(
                    'COMMUNITY CONTRIBUTIONS & LEADERSHIP',
                  ),
                  ...communityContributions.map(
                    (comm) =>
                      new Paragraph({
                        spacing: { after: 80 },
                        children: [
                          new TextRun({
                            text: `${comm.role} `,
                            bold: true,
                            size: 21,
                            font: 'Calibri',
                          }),
                          ...(comm.organization
                            ? [
                                new TextRun({
                                  text: `at ${comm.organization}`,
                                  size: 21,
                                  font: 'Calibri',
                                }),
                              ]
                            : []),
                          ...(comm.period
                            ? [
                                new TextRun({
                                  text: ` (${comm.period})`,
                                  size: 20,
                                  font: 'Calibri',
                                  color: '555555',
                                }),
                              ]
                            : []),
                          ...(comm.description
                            ? [
                                new TextRun({
                                  text: `\n${comm.description}`,
                                  size: 20,
                                  font: 'Calibri',
                                }),
                              ]
                            : []),
                        ],
                      }),
                  ),
                ]
              : []),
            // Certifications
            ...(certifications.length > 0
              ? [
                  this.createSectionHeading('CERTIFICATIONS'),
                  ...certifications.map(
                    (cert) =>
                      new Paragraph({
                        spacing: { after: 80 },
                        children: [
                          new TextRun({
                            text: `${cert.name} `,
                            bold: true,
                            size: 21,
                            font: 'Calibri',
                          }),
                          ...(cert.issuer
                            ? [
                                new TextRun({
                                  text: `- ${cert.issuer}`,
                                  size: 21,
                                  font: 'Calibri',
                                }),
                              ]
                            : []),
                          ...(cert.issueDate
                            ? [
                                new TextRun({
                                  text: ` (${cert.issueDate})`,
                                  size: 20,
                                  font: 'Calibri',
                                  color: '555555',
                                }),
                              ]
                            : []),
                        ],
                      }),
                  ),
                ]
              : []),
            // Languages
            ...(languages.length > 0
              ? [
                  this.createSectionHeading('LANGUAGES'),
                  new Paragraph({
                    spacing: { after: 200 },
                    children: [
                      new TextRun({
                        text: languages
                          .map((l) =>
                            l.fluency
                              ? `${l.language} (${l.fluency})`
                              : l.language,
                          )
                          .join(' • '),
                        size: 20,
                        font: 'Calibri',
                      }),
                    ],
                  }),
                ]
              : []),
            // Publications
            ...(publications.length > 0
              ? [
                  this.createSectionHeading('PUBLICATIONS'),
                  ...publications.map(
                    (pub) =>
                      new Paragraph({
                        spacing: { after: 80 },
                        children: [
                          new TextRun({
                            text: pub.title,
                            bold: true,
                            size: 21,
                            font: 'Calibri',
                          }),
                          ...(pub.publisher
                            ? [
                                new TextRun({
                                  text: ` - ${pub.publisher}`,
                                  size: 21,
                                  font: 'Calibri',
                                }),
                              ]
                            : []),
                          ...(pub.publicationDate
                            ? [
                                new TextRun({
                                  text: ` (${pub.publicationDate})`,
                                  size: 20,
                                  font: 'Calibri',
                                  color: '555555',
                                }),
                              ]
                            : []),
                        ],
                      }),
                  ),
                ]
              : []),
            // Honors & Awards
            ...(honorsAndAwards.length > 0
              ? [
                  this.createSectionHeading('HONORS & AWARDS'),
                  ...honorsAndAwards.map(
                    (award) =>
                      new Paragraph({
                        spacing: { after: 80 },
                        children: [
                          new TextRun({
                            text: award.title,
                            bold: true,
                            size: 21,
                            font: 'Calibri',
                          }),
                          ...(award.issuer
                            ? [
                                new TextRun({
                                  text: ` - ${award.issuer}`,
                                  size: 21,
                                  font: 'Calibri',
                                }),
                              ]
                            : []),
                          ...(award.date
                            ? [
                                new TextRun({
                                  text: ` (${award.date})`,
                                  size: 20,
                                  font: 'Calibri',
                                  color: '555555',
                                }),
                              ]
                            : []),
                        ],
                      }),
                  ),
                ]
              : []),
          ],
        },
      ],
    });

    return Packer.toBuffer(doc);
  }

  private createSectionHeading(title: string): Paragraph {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 100 },
      border: {
        bottom: {
          color: 'CCCCCC',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 22,
          font: 'Calibri',
          color: '111111',
        }),
      ],
    });
  }

  private async processTailoringWithLLM(
    targetRole: string,
    targetCompany: string,
    jobDescription: string,
    parsedGraph: ParsedResumeGraphData | null,
    acceptedMap?: Map<string, string>,
  ): Promise<{
    targetRole?: string;
    targetCompany?: string;
    matchedKeywords: string[];
    missingKeywords: string[];
    bulletDiffs: BulletDiffItem[];
  }> {
    if (!this.openai) {
      throw new BadRequestException(
        'OpenAI API key is missing or not configured on the server. Please provide OPENAI_API_KEY in backend environment to process AI tailoring.',
      );
    }

    try {
      const acceptedList = acceptedMap
        ? Array.from(acceptedMap.entries()).map(([orig, accepted]) => ({
            originalText: orig,
            acceptedText: accepted,
          }))
        : [];

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert ATS career tailoring assistant. Extract key skills from the job description, match them against candidate profile, and re-align experience bullets WITHOUT inventing fake claims, dates, or companies. IMPORTANT: If `targetRole` or `targetCompany` provided in user payload is generic (such as "Target Role", "Target Company", empty, or generic fallback), extract the real position title and hiring company name directly from the job description text or link. The candidate has ALREADY accepted modifications for the bullet statements listed in `acceptedList`. DO NOT revert or change these accepted statements; preserve them as accepted statements. Focus on optimizing remaining un-tailored bullets. Return a JSON object formatted with: { "targetRole": string, "targetCompany": string, "matchedKeywords": string[], "missingKeywords": string[], "bulletDiffs": Array<{ "id": string, "company": string, "role": string, "originalText": string, "tailoredText": string, "addedPhrase": string, "matchedKeywords": string[], "status": "pending" | "accepted" }> }',
          },
          {
            role: 'user',
            content: JSON.stringify({
              targetRole,
              targetCompany,
              jobDescription,
              parsedGraph,
              acceptedList,
            }),
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new InternalServerErrorException(
          'OpenAI returned an empty response.',
        );
      }

      const parsed = JSON.parse(content) as {
        targetRole?: string;
        targetCompany?: string;
        matchedKeywords?: string[];
        missingKeywords?: string[];
        bulletDiffs?: BulletDiffItem[];
      };

      if (!parsed.matchedKeywords || !parsed.bulletDiffs) {
        throw new InternalServerErrorException(
          'OpenAI response did not match the expected JSON output format.',
        );
      }

      return {
        targetRole: parsed.targetRole,
        targetCompany: parsed.targetCompany,
        matchedKeywords: parsed.matchedKeywords || [],
        missingKeywords: parsed.missingKeywords || [],
        bulletDiffs: parsed.bulletDiffs || [],
      };
    } catch (err: unknown) {
      if (
        err instanceof BadRequestException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }
      const errorMsg =
        err instanceof Error ? err.message : 'Unknown LLM tailoring failure';
      throw new InternalServerErrorException(
        `LLM Tailoring Engine failed: ${errorMsg}`,
      );
    }
  }
}
