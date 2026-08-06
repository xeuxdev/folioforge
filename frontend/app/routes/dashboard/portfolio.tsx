import type { Route } from "./+types/portfolio";
import { PortfolioSettings } from "~/components/dashboard/portfolio-settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio Generator | Dashboard | FolioForge" },
    {
      name: "description",
      content: "Auto-generated portfolio website templates synced with your master CV graph.",
    },
  ];
}

export default function DashboardPortfolio() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PortfolioSettings />
    </div>
  );
}
