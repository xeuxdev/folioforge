import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import type { CanonicalResumeGraph } from "~/types/resume";
import type { BulletDiffItem } from "~/components/dashboard/tailoring/diff-comparison-list";

export interface ExportResumeData {
  fullName: string;
  roleTitle: string;
  email: string;
  location: string;
  phone?: string;
  portfolioUrl: string;
  githubUrl?: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    location?: string;
    bullets: string[];
  }[];
  projects?: {
    title: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications?: {
    name: string;
    issuer?: string;
    issueDate?: string;
  }[];
  languages?: {
    language: string;
    fluency?: string;
  }[];
}

export const demoResumeData: ExportResumeData = {
  fullName: "ALEX MORGAN",
  roleTitle: "Senior Full-Stack Engineer",
  email: "alex.morgan@xeux.labs",
  location: "San Francisco, CA",
  phone: "+1 (555) 234-5678",
  portfolioUrl: "https://alexmorgan.dev",
  githubUrl: "https://github.com/alexmorgan",
  summary:
    "Senior Full-Stack Engineer with 6+ years of experience architecting high-throughput Node.js microservices, PostgreSQL databases with Drizzle ORM, and responsive React applications. Specialized in real-time document workflows, BullMQ worker queues, and ATS-tailored resume generation pipelines.",
  experience: [
    {
      company: "Xeux Labs",
      role: "Senior Full-Stack Engineer",
      period: "2023 - Present",
      location: "San Francisco, CA",
      bullets: [
        "Architected Node.js microservices and real-time document queues handling 2M+ active sessions with PostgreSQL optimization.",
        "Accelerated database query execution latency by 42% using PostgreSQL indexes and Drizzle ORM query tuning.",
        "Engineered server-side PDF generation pipeline using react-pdf renderer, cutting memory overhead by 65%.",
        "Led cross-functional engineering team of 5 developers building type-safe React Router v8 web applications.",
      ],
    },
    {
      company: "Vellum Technologies",
      role: "Full-Stack Software Engineer",
      period: "2021 - 2023",
      location: "San Jose, CA",
      bullets: [
        "Engineered high-performance React application dashboards with strict TypeScript types and Tailwind CSS v4.",
        "Integrated Redis BullMQ background queues for asynchronous document parsing tasks.",
        "Implemented RESTful Express APIs serving 500k+ monthly requests with 99.99% system availability.",
      ],
    },
  ],
  skills: [
    "TypeScript",
    "React 19",
    "React Router v8",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Drizzle ORM",
    "Redis",
    "BullMQ",
    "Tailwind CSS v4",
    "Docker",
    "REST APIs",
    "Vector ATS PDF Streams",
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "University of California, Berkeley",
      year: "2017 - 2021",
    },
  ],
};

/**
 * Builds dynamic ExportResumeData from real CanonicalResumeGraph and BulletDiffItems
 */
export function buildExportDataFromGraph(
  graph: CanonicalResumeGraph | null | undefined,
  bulletDiffs?: BulletDiffItem[],
  roleTitle?: string,
  targetCompany?: string
): ExportResumeData {
  if (!graph) {
    return {
      ...demoResumeData,
      roleTitle: roleTitle || demoResumeData.roleTitle,
    };
  }

  const contact = graph.contactInfo;
  const fullName = contact?.fullName || "Candidate Name";
  const email = contact?.email || "";
  const location = contact?.location || "";
  const phone = contact?.phone || "";
  const portfolioUrl =
    contact?.websiteUrl || contact?.linkedinUrl || "";
  const summary = graph.summary || "";

  const experience = (graph.workExperiences || []).map((exp, eIdx) => {
    const comp = exp.company || targetCompany || "Company";
    const pos = exp.position || roleTitle || "Software Engineer";
    const period = [
      exp.startDate,
      exp.endDate || (exp.isCurrent ? "Present" : ""),
    ]
      .filter(Boolean)
      .join(" - ");

    const bullets = (exp.bullets || []).map((origBullet, bIdx) => {
      const match = (bulletDiffs || []).find(
        (d) =>
          d.originalText === origBullet ||
          (d.company === comp && d.role === pos && d.id.endsWith(`-${bIdx + 1}`))
      );
      if (match) {
        return match.status === "rejected" ? match.originalText : match.tailoredText;
      }
      return origBullet;
    });

    return {
      company: comp,
      role: pos,
      period: period || "",
      location: exp.location,
      bullets: bullets.length > 0 ? bullets : exp.bullets || [],
    };
  });

  const skills = graph.skills || [];

  const education = (graph.education || []).map((edu) => ({
    degree:
      [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ") ||
      edu.degree ||
      edu.institution ||
      "Degree",
    institution: edu.institution || "",
    year: [edu.startDate, edu.endDate].filter(Boolean).join(" - ") || "",
  }));

  const projects = (graph.projects || []).map((p) => ({
    title: p.title || "Project",
    description: p.description || "",
    technologies: p.technologies || [],
    url: p.url,
  }));

  const certifications = (graph.certifications || []).map((c) => ({
    name: c.name || "Certification",
    issuer: c.issuer || "",
    issueDate: c.issueDate || "",
  }));

  const languages = (graph.languages || []).map((l) => ({
    language: l.language || "",
    fluency: l.fluency || "",
  }));

  return {
    fullName,
    roleTitle: roleTitle || "Software Engineer",
    email,
    location,
    phone,
    portfolioUrl,
    summary,
    experience,
    projects,
    skills,
    education,
    certifications,
    languages,
  };
}

/**
 * Generates and downloads a structured ATS-friendly Microsoft Word (.docx) document
 */
export async function downloadDocxResume(data: ExportResumeData) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children: [
          // Name (Title)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.fullName.toUpperCase(),
                bold: true,
                size: 32, // 16pt
                font: "Calibri",
              }),
            ],
          }),

          // Subtitle / Role & Contact
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: [data.roleTitle, data.location, data.email, data.portfolioUrl]
                  .filter(Boolean)
                  .join(" | "),
                size: 20, // 10pt
                font: "Calibri",
                color: "444444",
              }),
            ],
          }),

          // SECTION 1: Summary
          ...(data.summary
            ? [
                createSectionHeading("EXECUTIVE SUMMARY"),
                new Paragraph({
                  spacing: { after: 200 },
                  children: [
                    new TextRun({
                      text: data.summary,
                      size: 21, // 10.5pt
                      font: "Calibri",
                    }),
                  ],
                }),
              ]
            : []),

          // SECTION 2: Experience
          ...(data.experience.length > 0
            ? [
                createSectionHeading("WORK EXPERIENCE"),
                ...data.experience.flatMap((exp) => [
                  new Paragraph({
                    spacing: { before: 120, after: 40 },
                    children: [
                      new TextRun({
                        text: `${exp.company} `,
                        bold: true,
                        size: 22,
                        font: "Calibri",
                      }),
                      new TextRun({
                        text: `- ${exp.role}`,
                        bold: true,
                        size: 22,
                        font: "Calibri",
                      }),
                      ...(exp.period
                        ? [
                            new TextRun({
                              text: `\t${exp.period}`,
                              bold: true,
                              size: 20,
                              font: "Calibri",
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
                            font: "Calibri",
                          }),
                        ],
                      })
                  ),
                ]),
              ]
            : []),

          // SECTION 3: Technical Skills
          ...(data.skills.length > 0
            ? [
                createSectionHeading("TECHNICAL SKILLS"),
                new Paragraph({
                  spacing: { after: 200 },
                  children: [
                    new TextRun({
                      text: data.skills.join(" • "),
                      size: 20,
                      font: "Calibri",
                    }),
                  ],
                }),
              ]
            : []),

          // SECTION 4: Projects
          ...(data.projects && data.projects.length > 0
            ? [
                createSectionHeading("FEATURED PROJECTS"),
                ...data.projects.flatMap((proj) => [
                  new Paragraph({
                    spacing: { before: 100, after: 40 },
                    children: [
                      new TextRun({
                        text: proj.title,
                        bold: true,
                        size: 21,
                        font: "Calibri",
                      }),
                      ...(proj.technologies.length > 0
                        ? [
                            new TextRun({
                              text: ` (${proj.technologies.join(" • ")})`,
                              italics: true,
                              size: 19,
                              font: "Calibri",
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
                              font: "Calibri",
                            }),
                          ],
                        }),
                      ]
                    : []),
                ]),
              ]
            : []),

          // SECTION 5: Education
          ...(data.education.length > 0
            ? [
                createSectionHeading("EDUCATION"),
                ...data.education.map(
                  (edu) =>
                    new Paragraph({
                      spacing: { after: 80 },
                      children: [
                        new TextRun({
                          text: `${edu.degree} `,
                          bold: true,
                          size: 21,
                          font: "Calibri",
                        }),
                        ...(edu.institution
                          ? [
                              new TextRun({
                                text: `- ${edu.institution}`,
                                size: 21,
                                font: "Calibri",
                              }),
                            ]
                          : []),
                        ...(edu.year
                          ? [
                              new TextRun({
                                text: ` (${edu.year})`,
                                size: 20,
                                font: "Calibri",
                                color: "555555",
                              }),
                            ]
                          : []),
                      ],
                    })
                ),
              ]
            : []),

          // SECTION 6: Certifications
          ...(data.certifications && data.certifications.length > 0
            ? [
                createSectionHeading("CERTIFICATIONS"),
                ...data.certifications.map(
                  (cert) =>
                    new Paragraph({
                      spacing: { after: 80 },
                      children: [
                        new TextRun({
                          text: `${cert.name} `,
                          bold: true,
                          size: 21,
                          font: "Calibri",
                        }),
                        ...(cert.issuer
                          ? [
                              new TextRun({
                                text: `- ${cert.issuer}`,
                                size: 21,
                                font: "Calibri",
                              }),
                            ]
                          : []),
                        ...(cert.issueDate
                          ? [
                              new TextRun({
                                text: ` (${cert.issueDate})`,
                                size: 20,
                                font: "Calibri",
                                color: "555555",
                              }),
                            ]
                          : []),
                      ],
                    })
                ),
              ]
            : []),

          // SECTION 7: Languages
          ...(data.languages && data.languages.length > 0
            ? [
                createSectionHeading("LANGUAGES"),
                new Paragraph({
                  spacing: { after: 200 },
                  children: [
                    new TextRun({
                      text: data.languages
                        .map((l) =>
                          l.fluency ? `${l.language} (${l.fluency})` : l.language
                        )
                        .join(" • "),
                      size: 20,
                      font: "Calibri",
                    }),
                  ],
                }),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.fullName.replace(/\s+/g, "_")}_ATS_Resume.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates an ATS Section Divider Heading for DOCX
 */
function createSectionHeading(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 180, after: 100 },
    border: {
      bottom: {
        color: "CCCCCC",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // 11pt
        font: "Calibri",
        color: "111111",
      }),
    ],
  });
}

/**
 * Generates and downloads/prints a clean single-column ATS vector PDF stream
 */
export function downloadPdfResume(data: ExportResumeData) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const contactLine = [
    data.roleTitle,
    data.location,
    data.email,
    data.phone,
    data.portfolioUrl,
  ]
    .filter(Boolean)
    .join(" &bull; ");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.fullName} - ATS Resume PDF</title>
  <style>
    @page {
      size: letter;
      margin: 0.5in;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
      line-height: 1.45;
      font-size: 10.5pt;
      margin: 0;
      padding: 20px;
      background: #ffffff;
    }
    .header {
      text-align: center;
      border-bottom: 1.5px solid #111827;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header h1 {
      font-size: 18pt;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #000000;
    }
    .header p {
      font-size: 9.5pt;
      margin: 0;
      color: #374151;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 8px;
      color: #111827;
    }
    .exp-item {
      margin-bottom: 10px;
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 10.5pt;
      margin-bottom: 3px;
    }
    .exp-period {
      font-weight: normal;
      color: #4b5563;
      font-size: 9.5pt;
    }
    ul {
      margin: 4px 0 8px 18px;
      padding: 0;
    }
    li {
      margin-bottom: 3px;
      font-size: 10pt;
    }
    .skills-text {
      font-size: 10pt;
      color: #1f2937;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.fullName}</h1>
    <p>${contactLine}</p>
  </div>

  ${
    data.summary
      ? `
  <div class="section-title">Executive Summary</div>
  <p style="margin: 0 0 10px 0; font-size: 10pt;">${data.summary}</p>
  `
      : ""
  }

  ${
    data.experience.length > 0
      ? `
  <div class="section-title">Work Experience</div>
  ${data.experience
    .map(
      (exp) => `
    <div class="exp-item">
      <div class="exp-header">
        <span>${exp.company} — ${exp.role}</span>
        ${exp.period ? `<span class="exp-period">${exp.period}</span>` : ""}
      </div>
      <ul>
        ${exp.bullets.map((b) => `<li>${b}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("")}
  `
      : ""
  }

  ${
    data.skills.length > 0
      ? `
  <div class="section-title">Technical Skills & Core Competencies</div>
  <p class="skills-text">${data.skills.join(" • ")}</p>
  `
      : ""
  }

  ${
    data.projects && data.projects.length > 0
      ? `
  <div class="section-title">Featured Projects</div>
  ${data.projects
    .map(
      (p) => `
    <div style="margin-bottom: 8px;">
      <div style="font-weight: bold; font-size: 10pt;">
        ${p.title}${p.technologies.length > 0 ? ` <em>(${p.technologies.join(" • ")})</em>` : ""}
      </div>
      ${p.description ? `<p style="margin: 2px 0 0 0; font-size: 9.5pt; color: #374151;">${p.description}</p>` : ""}
    </div>
  `
    )
    .join("")}
  `
      : ""
  }

  ${
    data.education.length > 0
      ? `
  <div class="section-title">Education</div>
  ${data.education
    .map(
      (edu) => `
    <p style="margin: 0 0 4px 0; font-size: 10pt;">
      <strong>${edu.degree}</strong>${edu.institution ? ` — ${edu.institution}` : ""}${
        edu.year ? ` (${edu.year})` : ""
      }
    </p>
  `
    )
    .join("")}
  `
      : ""
  }

  ${
    data.certifications && data.certifications.length > 0
      ? `
  <div class="section-title">Certifications</div>
  ${data.certifications
    .map(
      (c) => `
    <p style="margin: 0 0 4px 0; font-size: 10pt;">
      <strong>${c.name}</strong>${c.issuer ? ` — ${c.issuer}` : ""}${c.issueDate ? ` (${c.issueDate})` : ""}
    </p>
  `
    )
    .join("")}
  `
      : ""
  }

  ${
    data.languages && data.languages.length > 0
      ? `
  <div class="section-title">Languages</div>
  <p class="skills-text">
    ${data.languages
      .map((l) => (l.fluency ? `${l.language} (${l.fluency})` : l.language))
      .join(" • ")}
  </p>
  `
      : ""
  }

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
