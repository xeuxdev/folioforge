import type { CanonicalResumeGraph } from "~/types/resume";
import type { PortfolioData } from "~/components/portfolio/minimal-template";

/**
 * Transforms a CanonicalResumeGraph (backend shape) into the PortfolioData
 * shape consumed by the portfolio templates.
 *
 * STRICT REQUIREMENT: Only uses actual data present in the canonical resume graph.
 * Does NOT inject fake/hardcoded demo fallbacks.
 */
export function canonicalToPortfolioData(
  graph: CanonicalResumeGraph | null | undefined,
  overrides?: Partial<PortfolioData>,
): PortfolioData {
  if (!graph) {
    return {
      fullName: "Candidate",
      roleTitle: "",
      bio: "",
      email: "",
      location: "",
      githubUrl: "",
      portfolioUrl: "",
      linkedinUrl: "",
      skills: [],
      experience: [],
      projects: [],
      education: [],
      ...overrides,
    };
  }

  const contact = graph.contactInfo ?? {};

  const experience = (graph.workExperiences ?? []).map((exp) => {
    const start = exp.startDate ?? "";
    const end = exp.isCurrent ? "Present" : (exp.endDate ?? "");
    const period = start && end ? `${start} - ${end}` : start || end;

    return {
      company: exp.company || "",
      role: exp.position || "",
      period: period || "",
      location: exp.location ?? "",
      bullets: exp.bullets ?? [],
    };
  });

  const projects = (graph.projects ?? []).map((proj) => ({
    title: proj.title || "Project",
    description: proj.description ?? "",
    tech: proj.technologies ?? [],
    link: proj.url,
  }));

  const education = (graph.education ?? []).map((edu) => {
    const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
    const year = [edu.startDate, edu.endDate].filter(Boolean).join(" - ") || edu.endDate || edu.startDate || "";
    return {
      degree: degree || edu.degree || edu.institution || "Education Record",
      institution: edu.institution || "",
      year,
    };
  });

  return {
    fullName: contact.fullName || "Candidate",
    roleTitle: experience[0]?.role || "",
    bio: graph.summary || "",
    email: contact.email || "",
    location: contact.location || "",
    githubUrl: contact.githubUrl || "",
    portfolioUrl: contact.websiteUrl || "",
    linkedinUrl: contact.linkedinUrl || "",
    skills: graph.skills || [],
    experience,
    projects,
    education,
    ...overrides,
  };
}
