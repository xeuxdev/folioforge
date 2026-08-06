import type { Route } from "./+types/import";
import { CvUploadZone } from "~/components/dashboard/cv-upload-zone";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload & Parse CV | Dashboard | FolioForge" },
    {
      name: "description",
      content: "Upload existing PDF or DOCX resume documents into BullMQ parser pipelines.",
    },
  ];
}

export default function DashboardImport() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <CvUploadZone />
    </div>
  );
}
