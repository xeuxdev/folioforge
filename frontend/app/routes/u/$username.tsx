import type { Route } from "./+types/$username";
import { PortfolioViewer } from "~/components/portfolio/portfolio-viewer";
import { defaultPortfolioData } from "~/components/portfolio/minimal-template";

export function meta({ params }: Route.MetaArgs) {
  const username = params.username || "alex";
  return [
    { title: `Alex Morgan | Senior Full-Stack Engineer | FolioForge` },
    {
      name: "description",
      content:
        "Full-Stack Engineer specializing in high-throughput Node.js microservices, PostgreSQL query optimization, and type-safe React applications.",
    },
    { property: "og:title", content: `Alex Morgan | Senior Full-Stack Engineer` },
    {
      property: "og:description",
      content:
        "Full-Stack Engineer specializing in high-throughput Node.js microservices, PostgreSQL query optimization, and type-safe React applications.",
    },
  ];
}

export default function UserPortfolioRoute({ params }: Route.ComponentProps) {
  const username = params.username || "alex";

  return (
    <PortfolioViewer
      data={defaultPortfolioData}
      username={username}
      initialTemplate="minimal"
    />
  );
}
