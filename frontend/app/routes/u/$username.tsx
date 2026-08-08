import { useSearchParams } from "react-router";
import type { Route } from "./+types/$username";
import { PortfolioViewer } from "~/components/portfolio/portfolio-viewer";
import {
  defaultPortfolioData,
} from "~/components/portfolio/minimal-template";
import { canonicalToPortfolioData } from "~/lib/portfolio-adapter";
import type { PublicPortfolioPayload } from "~/types/portfolio";

export async function loader({ params, request }: Route.LoaderArgs) {
  const username = params.username;

  try {
    // Forward cookies so the API proxy can pass them through
    const cookieHeader = request.headers.get("Cookie") ?? "";
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

    const res = await fetch(
      `${backendUrl}/api/v1/portfolio/u/${username}`,
      {
        headers: { Cookie: cookieHeader },
      },
    );

    if (!res.ok) {
      return { portfolio: null as PublicPortfolioPayload | null };
    }

    const portfolio = (await res.json()) as PublicPortfolioPayload;
    return { portfolio };
  } catch {
    return { portfolio: null as PublicPortfolioPayload | null };
  }
}

export function meta({ loaderData, params }: Route.MetaArgs) {
  const username = params.username ?? "user";
  const portfolio = loaderData?.portfolio as PublicPortfolioPayload | null | undefined;

  if (!portfolio) {
    return [
      { title: `Portfolio | FolioForge` },
      { name: "description", content: "Portfolio powered by FolioForge." },
    ];
  }

  const graph = portfolio.resumeGraph;
  const name = portfolio.name;
  const role =
    graph?.workExperiences?.[0]?.position ?? "Professional";

  const summary =
    graph?.summary ??
    `${name}'s professional portfolio powered by FolioForge.`;

  return [
    { title: `${name} | ${role} | FolioForge` },
    { name: "description", content: summary },
    { property: "og:title", content: `${name} | ${role}` },
    { property: "og:description", content: summary },
  ];
}

export default function UserPortfolioRoute({ loaderData, params }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const username = params.username ?? "user";
  const portfolio = loaderData?.portfolio as PublicPortfolioPayload | null | undefined;

  const portfolioData =
    portfolio?.resumeGraph
      ? canonicalToPortfolioData(portfolio.resumeGraph)
      : defaultPortfolioData;

  const queryTheme = searchParams.get("theme");
  const selectedTheme =
    queryTheme === "minimal" || queryTheme === "executive"
      ? queryTheme
      : (portfolio?.selectedTemplate ?? "minimal");

  return (
    <PortfolioViewer
      data={portfolioData}
      username={username}
      template={selectedTheme}
    />
  );
}
