import type { Route } from "./+types/tailor";
import { AiTailorDiffViewer } from "~/components/dashboard/ai-tailor-diff-viewer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Tailor | Dashboard | FolioForge" },
    {
      name: "description",
      content:
        "Tailor experience bullet points to target job descriptions with zero hallucinations.",
    },
  ];
}

export default function DashboardTailor() {
  return (
    <div className="mx-auto text-foreground space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2 pb-6 border-b border-border">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">
            AI Resume Tailor
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Job Description & ATS Optimization
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tailor experience bullets to target roles with factual truth grounding and zero hallucinations.
          </p>
        </div>
      </div>

      <AiTailorDiffViewer />
    </div>
  );
}
