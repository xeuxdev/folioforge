import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import OpenAI from 'openai';

export interface ContactInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  location?: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  gpa?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  technologies: string[];
  url?: string;
}

export interface CommunityContribution {
  id: string;
  organization: string;
  role: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  bullets?: string[];
  url?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  id: string;
  language: string;
  fluency?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher?: string;
  publicationDate?: string;
  url?: string;
  description?: string;
}

export interface HonorAndAward {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface CanonicalResumeGraph {
  contactInfo: ContactInfo;
  summary?: string;
  workExperiences: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  communityContributions?: CommunityContribution[];
  certifications?: Certification[];
  languages?: Language[];
  publications?: Publication[];
  honorsAndAwards?: HonorAndAward[];
}

interface OpenAIResumeResult {
  contactInfo?: Partial<ContactInfo>;
  summary?: string;
  workExperiences?: Array<Partial<WorkExperience>>;
  education?: Array<Partial<Education>>;
  skills?: string[];
  projects?: Array<Partial<Project>>;
  communityContributions?: Array<Partial<CommunityContribution>>;
  certifications?: Array<Partial<Certification>>;
  languages?: Array<Partial<Language>>;
  publications?: Array<Partial<Publication>>;
  honorsAndAwards?: Array<Partial<HonorAndAward>>;
}

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);

  async extractRawText(buffer: Buffer, mimeType: string): Promise<string> {
    if (mimeType === 'application/pdf') {
      try {
        const pdfParser = new PDFParse({ data: buffer });
        const data = await pdfParser.getText();
        return data.text || '';
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'PDF parse error';
        this.logger.error(`Failed to extract text from PDF: ${message}`);
        throw new BadRequestException(
          `Could not parse PDF document: ${message}`,
        );
      }
    }

    if (
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '';
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'DOCX parse error';
        this.logger.error(`Failed to extract text from DOCX: ${message}`);
        throw new BadRequestException(
          `Could not parse DOCX document: ${message}`,
        );
      }
    }

    throw new BadRequestException(
      `Unsupported file format (${mimeType}). Only PDF and DOCX documents are accepted.`,
    );
  }

  async parseTextToResumeGraph(rawText: string): Promise<CanonicalResumeGraph> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });
        const model = process.env.OPENAI_MODEL!;

        this.logger.log(`Parsing resume graph using OpenAI model: ${model}`);

        const completion = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert AI resume parser. Extract structured details from the provided raw resume text and return a JSON object adhering strictly to the schema. Do not include markdown formatting or extra commentary.',
            },
            {
              role: 'user',
              content: `Parse this resume raw text into JSON:

${rawText}

JSON Output Schema:
{
  "contactInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedinUrl": "string",
    "githubUrl": "string",
    "websiteUrl": "string"
  },
  "summary": "string",
  "workExperiences": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string",
      "isCurrent": boolean,
      "location": "string",
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "string",
      "endDate": "string",
      "location": "string",
      "gpa": "string"
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "url": "string"
    }
  ],
  "communityContributions": [
    {
      "organization": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "location": "string",
      "description": "string",
      "bullets": ["string"],
      "url": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "issueDate": "string",
      "expirationDate": "string",
      "credentialId": "string",
      "url": "string"
    }
  ],
  "languages": [
    {
      "language": "string",
      "fluency": "string"
    }
  ],
  "publications": [
    {
      "title": "string",
      "publisher": "string",
      "publicationDate": "string",
      "url": "string",
      "description": "string"
    }
  ],
  "honorsAndAwards": [
    {
      "title": "string",
      "issuer": "string",
      "date": "string",
      "description": "string"
    }
  ]
}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as OpenAIResumeResult;
          this.logger.log('Successfully parsed resume graph using OpenAI!');
          return this.normalizeOpenAIResult(parsed, rawText);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unknown OpenAI error';
        const stack = err instanceof Error ? err.stack : undefined;
        this.logger.error(
          `OpenAI parsing failed (${message}), falling back to regex parser.`,
          stack,
        );
      }
    } else {
      this.logger.log(
        'OPENAI_API_KEY not set; using fallback regex parser for resume processing.',
      );
    }

    return this.parseTextWithRegex(rawText);
  }

  private normalizeOpenAIResult(
    parsed: OpenAIResumeResult,
    rawText: string,
  ): CanonicalResumeGraph {
    const contactInfo: ContactInfo = {
      fullName: parsed.contactInfo?.fullName || 'Candidate',
      email: parsed.contactInfo?.email,
      phone: parsed.contactInfo?.phone,
      location: parsed.contactInfo?.location,
      linkedinUrl: parsed.contactInfo?.linkedinUrl,
      githubUrl: parsed.contactInfo?.githubUrl,
      websiteUrl: parsed.contactInfo?.websiteUrl,
    };

    const workExperiences: WorkExperience[] = (
      parsed.workExperiences || []
    ).map((exp) => ({
      id: exp.id || randomUUID(),
      company: exp.company || 'Company',
      position: exp.position || 'Role',
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      location: exp.location,
      bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
    }));

    const education: Education[] = (parsed.education || []).map((edu) => ({
      id: edu.id || randomUUID(),
      institution: edu.institution || 'University / Institution',
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      location: edu.location,
      gpa: edu.gpa,
    }));

    const projects: Project[] = (parsed.projects || []).map((proj) => ({
      id: proj.id || randomUUID(),
      title: proj.title || 'Project',
      description: proj.description,
      technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
      url: proj.url,
    }));

    const communityContributions: CommunityContribution[] = (
      parsed.communityContributions || []
    ).map((item) => ({
      id: item.id || randomUUID(),
      organization: item.organization || 'Organization',
      role: item.role || 'Contributor / Volunteer',
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
      description: item.description,
      bullets: Array.isArray(item.bullets) ? item.bullets : [],
      url: item.url,
    }));

    const certifications: Certification[] = (parsed.certifications || []).map(
      (cert) => ({
        id: cert.id || randomUUID(),
        name: cert.name || 'Certification',
        issuer: cert.issuer || 'Issuing Organization',
        issueDate: cert.issueDate,
        expirationDate: cert.expirationDate,
        credentialId: cert.credentialId,
        url: cert.url,
      }),
    );

    const languages: Language[] = (parsed.languages || []).map((lang) => ({
      id: lang.id || randomUUID(),
      language: lang.language || 'Language',
      fluency: lang.fluency,
    }));

    const publications: Publication[] = (parsed.publications || []).map(
      (pub) => ({
        id: pub.id || randomUUID(),
        title: pub.title || 'Publication Title',
        publisher: pub.publisher,
        publicationDate: pub.publicationDate,
        url: pub.url,
        description: pub.description,
      }),
    );

    const honorsAndAwards: HonorAndAward[] = (parsed.honorsAndAwards || []).map(
      (award) => ({
        id: award.id || randomUUID(),
        title: award.title || 'Award Title',
        issuer: award.issuer,
        date: award.date,
        description: award.description,
      }),
    );

    const skills = Array.isArray(parsed.skills) ? parsed.skills : [];

    return {
      contactInfo,
      summary: parsed.summary || rawText.substring(0, 300),
      workExperiences,
      education,
      skills,
      projects,
      communityContributions,
      certifications,
      languages,
      publications,
      honorsAndAwards,
    };
  }

  parseTextWithRegex(rawText: string): CanonicalResumeGraph {
    const lines = rawText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex =
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const linkedinRegex =
      /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
    const githubRegex = /(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+/i;

    const emailMatch = rawText.match(emailRegex);
    const phoneMatch = rawText.match(phoneRegex);
    const linkedinMatch = rawText.match(linkedinRegex);
    const githubMatch = rawText.match(githubRegex);

    const fullName = lines.length > 0 ? lines[0] : 'Candidate';

    const bullets: string[] = [];
    const skillsSet = new Set<string>();

    for (const line of lines) {
      if (
        line.startsWith('•') ||
        line.startsWith('-') ||
        line.startsWith('*')
      ) {
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 5) {
          bullets.push(cleanBullet);
        }
      }

      // Basic keyword skill detection heuristics
      const commonSkills = [
        'TypeScript',
        'JavaScript',
        'React',
        'Node.js',
        'NestJS',
        'Express',
        'PostgreSQL',
        'SQL',
        'Python',
        'Docker',
        'AWS',
        'Git',
        'HTML',
        'CSS',
        'TailwindCSS',
        'GraphQL',
        'REST API',
        'Redis',
        'Linux',
      ];

      for (const skill of commonSkills) {
        const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
        if (regex.test(line)) {
          skillsSet.add(skill);
        }
      }
    }

    const workExperiences: WorkExperience[] = [];
    if (bullets.length > 0) {
      workExperiences.push({
        id: randomUUID(),
        company: 'Experience',
        position: 'Professional Role',
        bullets: bullets.slice(0, 10),
      });
    }

    return {
      contactInfo: {
        fullName,
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        linkedinUrl: linkedinMatch ? linkedinMatch[0] : undefined,
        githubUrl: githubMatch ? githubMatch[0] : undefined,
      },
      summary: lines.slice(1, 4).join(' ').substring(0, 300),
      workExperiences,
      education: [],
      skills: Array.from(skillsSet),
      projects: [],
    };
  }
}
