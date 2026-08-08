import type { CanonicalResumeGraph } from "~/types/resume";
import type { PortfolioData } from "~/components/portfolio/minimal-template";
import { defaultPortfolioData } from "~/components/portfolio/minimal-template";

/**
 * Transforms a CanonicalResumeGraph (backend shape) into the PortfolioData
 * shape consumed by the MinimalTemplate and ExecutiveTemplate components.
 *
 * Falls back to individual `defaultPortfolioData` field values when the graph
 * is missing a field, so the templates always have something sensible to show.
 */
export function canonicalToPortfolioData(
  graph: CanonicalResumeGraph,
  overrides?: Partial<PortfolioData>,
): PortfolioData {
  const contact = graph.contactInfo ?? {};

  const experience = (graph.workExperiences ?? []).map((exp) => {
    const start = exp.startDate ?? "";
    const end = exp.isCurrent ? "Present" : (exp.endDate ?? "");
    const period = start && end ? `${start} - ${end}` : start || end;

    return {
      company: exp.company,
      role: exp.position,
      period,
      location: exp.location ?? "",
      bullets: exp.bullets ?? [],
    };
  });

  const projects = (graph.projects ?? []).map((proj) => ({
    title: proj.title,
    description: proj.description ?? "",
    tech: proj.technologies ?? [],
    link: proj.url,
  }));

  const education = (graph.education ?? []).map((edu) => {
    const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
    const year = edu.endDate ?? edu.startDate ?? "";
    return {
      degree: degree || "Degree",
      institution: edu.institution,
      year,
    };
  });

  return {
    fullName: contact.fullName || defaultPortfolioData.fullName,
    roleTitle:
      experience[0]?.role || defaultPortfolioData.roleTitle,
    bio: graph.summary || defaultPortfolioData.bio,
    email: contact.email || defaultPortfolioData.email,
    location: contact.location || defaultPortfolioData.location,
    githubUrl: contact.githubUrl || defaultPortfolioData.githubUrl,
    portfolioUrl: contact.websiteUrl || defaultPortfolioData.portfolioUrl,
    linkedinUrl: contact.linkedinUrl || defaultPortfolioData.linkedinUrl,
    skills: graph.skills?.length ? graph.skills : defaultPortfolioData.skills,
    experience: experience.length ? experience : defaultPortfolioData.experience,
    projects: projects.length ? projects : defaultPortfolioData.projects,
    education: education.length ? education : defaultPortfolioData.education,
    ...overrides,
  };
}
