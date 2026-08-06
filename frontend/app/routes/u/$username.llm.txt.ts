import type { Route } from "./+types/$username.llm.txt";
import { defaultPortfolioData } from "~/components/portfolio/minimal-template";

export function loader({ params }: Route.LoaderArgs) {
  const username = params.username || "alex";
  const data = defaultPortfolioData;

  const markdownContent = `# ${data.fullName} - ${data.roleTitle}

> Location: ${data.location}
> Email: ${data.email}
> Portfolio: ${data.portfolioUrl}
> GitHub: ${data.githubUrl}

## Professional Summary
${data.bio}

## Work Experience
${data.experience
  .map(
    (exp) => `### ${exp.company} - ${exp.role} (${exp.period})
Location: ${exp.location}
Key Achievements:
${exp.bullets.map((b) => `- ${b}`).join("\n")}`
  )
  .join("\n\n")}

## Featured Technical Projects
${data.projects
  .map(
    (proj) => `### ${proj.title}
${proj.description}
Stack: ${proj.tech.join(", ")}
URL: ${proj.link || "N/A"}`
  )
  .join("\n\n")}

## Technical Skills & Stack
${data.skills.join(", ")}

## Education & Qualifications
${data.education
  .map((edu) => `- ${edu.degree}, ${edu.institution} (${edu.year})`)
  .join("\n")}
`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
