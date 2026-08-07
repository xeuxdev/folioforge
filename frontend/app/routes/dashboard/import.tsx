import { useState } from "react";
import type { Route } from "./+types/import";
import { useResumes, type ResumeRecord } from "~/hooks/use-resumes";
import type { CanonicalResumeGraph } from "~/types/resume";
import { ResumeUploader } from "~/components/dashboard/resume-uploader";
import { ResumeEditor } from "~/components/dashboard/resume-editor";
import { ResumeSelector } from "~/components/dashboard/resume-selector";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload & Parse CV | Dashboard | FolioForge" },
    {
      name: "description",
      content:
        "Upload existing PDF or DOCX resume documents and verify parsed single-source-of-truth data.",
    },
  ];
}

export default function DashboardImport() {
  const { resumes, deleteResume, updateResume, isUpdating, isDeleting } = useResumes();
  const [overrideActiveResume, setOverrideActiveResume] = useState<ResumeRecord | null>(null);
  const [isExplicitUploadMode, setIsExplicitUploadMode] = useState(false);

  const activeResume = isExplicitUploadMode
    ? overrideActiveResume
    : overrideActiveResume || (resumes.length > 0 ? resumes[0] : null);

  const handleSaveEditor = async (
    title: string,
    graph: CanonicalResumeGraph,
  ) => {
    if (!activeResume) return;
    const updated = await updateResume({
      id: activeResume.id,
      title,
      parsedData: graph,
    });
    setOverrideActiveResume(updated);
  };

  const handleDeleteResume = async (idToDelete?: string) => {
    const id = idToDelete || activeResume?.id;
    if (!id) return;
    await deleteResume(id);
    setOverrideActiveResume(null);
    setIsExplicitUploadMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Upload & Parse Resume
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ingest PDF or DOCX documents to extract structured canonical resume
            graph data.
          </p>
        </div>

        {activeResume && !isExplicitUploadMode && (
          <Button
            variant="outline"
            onClick={() => {
              setIsExplicitUploadMode(true);
              setOverrideActiveResume(null);
            }}
            className="cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Upload Another CV
          </Button>
        )}
      </div>

      {resumes.length > 0 && (
        <ResumeSelector
          resumes={resumes}
          selectedResumeId={activeResume?.id || null}
          onSelectResume={(id) => {
            const selected = resumes.find((r) => r.id === id) || null;
            setOverrideActiveResume(selected);
            setIsExplicitUploadMode(false);
          }}
          onDeleteResume={handleDeleteResume}
          isDeleting={isDeleting}
          onUploadClick={() => {
            setIsExplicitUploadMode(true);
            setOverrideActiveResume(null);
          }}
        />
      )}

      {!activeResume ? (
        <div className="bg-card p-8 sm:p-10 rounded-xl border border-border space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Upload Resume Document</h2>
            <p className="text-sm text-muted-foreground">
              Uploaded files are stored securely and parsed automatically into
              standard JSON schemas.
            </p>
          </div>

          <ResumeUploader
            onUploadSuccess={(uploadedRecord) => {
              setOverrideActiveResume(uploadedRecord);
              setIsExplicitUploadMode(false);
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-sm text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>
              Resume ingested & parsed successfully! Review and edit the parsed
              canonical fields below.
            </span>
          </div>

          <ResumeEditor
            initialGraph={
              activeResume.parsedData || {
                contactInfo: { fullName: "Candidate" },
                workExperiences: [],
                education: [],
                skills: [],
                projects: [],
                communityContributions: [],
                certifications: [],
                languages: [],
              }
            }
            resumeTitle={activeResume.title}
            onSave={handleSaveEditor}
            onDelete={() => handleDeleteResume(activeResume.id)}
            isSaving={isUpdating}
            isDeleting={isDeleting}
          />
        </div>
      )}
    </div>
  );
}

