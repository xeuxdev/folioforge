import type { Route } from "./+types/portfolio";
import { PortfolioSettings } from "~/components/dashboard/portfolio-settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Portfolio Builder | Dashboard | FolioForge" },
    {
      name: "description",
      content:
        "Auto-generated portfolio website templates synced with your master CV graph.",
    },
  ];
}

export default function DashboardPortfolio() {
  return (
    <div className="mx-auto text-foreground space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2 pb-6 border-b border-border">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Portfolio Builder
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Live Website & Custom Domains
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Publish real-time synced portfolio sites and machine-readable AI agent endpoints.
          </p>
        </div>
      </div>

      <PortfolioSettings />
    </div>
  );
}
