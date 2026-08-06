import type { Route } from "./+types/index";
import { MasterResumeEditor } from "~/components/dashboard/master-resume-editor";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Master Resume Graph | Dashboard | FolioForge" },
    {
      name: "description",
      content: "Manage your canonical single source of truth resume graph with Zod-validated TypeScript schemas.",
    },
  ];
}

export default function DashboardIndex() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <MasterResumeEditor />
    </div>
  );
}
