import type { Route } from "./+types/tailor";
import { AiTailorDiffViewer } from "~/components/dashboard/ai-tailor-diff-viewer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Tailoring Engine | Dashboard | FolioForge" },
    {
      name: "description",
      content: "Tailor experience bullet points to target job descriptions with zero hallucinations.",
    },
  ];
}

export default function DashboardTailor() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AiTailorDiffViewer />
    </div>
  );
}
