import type { Route } from "./+types/$username.llm.txt";
import type { PublicPortfolioPayload } from "~/types/portfolio";
import type { CanonicalResumeGraph } from "~/types/resume";

export async function loader({ params, request }: Route.LoaderArgs) {
  const username = params.username ?? "user";
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

  let portfolio: PublicPortfolioPayload | null = null;

  try {
    const res = await fetch(`${backendUrl}/api/v1/portfolio/u/${username}/llm.txt`, {
      headers: { Cookie: cookieHeader },
    });

    if (res.ok) {
      const text = await res.text();
      return new Response(text, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }

    if (res.status === 404) {
      return new Response("Not Found", { status: 404 });
    }
  } catch {
    // Fall through to client-side fallback below
  }

  // If the backend is unreachable, try fetching the JSON portfolio and build
  // the markdown locally as a graceful degradation.
  try {
    const res = await fetch(`${backendUrl}/api/v1/portfolio/u/${username}`, {
      headers: { Cookie: cookieHeader },
    });
    if (res.ok) {
      portfolio = (await res.json()) as PublicPortfolioPayload;
    }
  } catch {
    // nothing
  }

  if (!portfolio) {
    return new Response("Portfolio not found", { status: 404 });
  }

  if (!portfolio.llmTxtEnabled) {
    return new Response("Not Found", { status: 404 });
  }

  const graph: CanonicalResumeGraph | null = portfolio.resumeGraph;
  const markdown = buildMarkdown(portfolio.name, username, graph);

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function buildMarkdown(
  name: string,
  username: string,
  graph: CanonicalResumeGraph | null,
): string {
  const contact = graph?.contactInfo ?? {};
  const lines: string[] = [`# ${name}`, ""];

  if (contact.email) lines.push(`> Email: ${contact.email}`);
  if (contact.location) lines.push(`> Location: ${contact.location}`);
  if (contact.linkedinUrl) lines.push(`> LinkedIn: ${contact.linkedinUrl}`);
  if (contact.githubUrl) lines.push(`> GitHub: ${contact.githubUrl}`);
  if (contact.websiteUrl) lines.push(`> Portfolio: ${contact.websiteUrl}`);

  if (graph?.summary) {
    lines.push("", "## Professional Summary", graph.summary);
  }

  if (graph?.workExperiences?.length) {
    lines.push("", "## Work Experience");
    for (const exp of graph.workExperiences) {
      const start = exp.startDate ?? "";
      const end = exp.isCurrent ? "Present" : (exp.endDate ?? "");
      const period = start && end ? `${start} - ${end}` : start || end;
      lines.push(
        `### ${exp.company} - ${exp.position}${period ? ` (${period})` : ""}`,
      );
      if (exp.location) lines.push(`Location: ${exp.location}`);
      if (exp.bullets?.length) {
        lines.push("Key Achievements:");
        for (const bullet of exp.bullets) {
          lines.push(`- ${bullet}`);
        }
      }
      lines.push("");
    }
  }

  if (graph?.projects?.length) {
    lines.push("## Featured Projects");
    for (const proj of graph.projects) {
      lines.push(`### ${proj.title}`);
      if (proj.description) lines.push(proj.description);
      if (proj.technologies?.length)
        lines.push(`Stack: ${proj.technologies.join(", ")}`);
      if (proj.url) lines.push(`URL: ${proj.url}`);
      lines.push("");
    }
  }

  if (graph?.skills?.length) {
    lines.push("## Technical Skills", graph.skills.join(", "), "");
  }

  if (graph?.education?.length) {
    lines.push("## Education");
    for (const edu of graph.education) {
      const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
      const year = edu.endDate ?? edu.startDate ?? "";
      lines.push(
        `- ${degree ? `${degree}, ` : ""}${edu.institution}${year ? ` (${year})` : ""}`,
      );
    }
  }

  return lines.join("\n");
}
