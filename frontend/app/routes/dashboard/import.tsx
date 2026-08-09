import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/import";
import { useResumes, type ResumeRecord } from "~/hooks/use-resumes";
import { ResumeUploader } from "~/components/dashboard/resume-uploader";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Plus,
  FileCheck2,
  ShieldCheck,
  Zap,
  FolderKanban,
} from "lucide-react";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Import Resume | Dashboard | FolioForge" },
    {
      name: "description",
      content:
        "Upload existing PDF or DOCX resume documents to generate structured single-source-of-truth data.",
    },
  ];
}

export default function DashboardImport() {
  const { resumes } = useResumes();
  const navigate = useNavigate();
  const [justUploadedResume, setJustUploadedResume] =
    useState<ResumeRecord | null>(null);

  const handleUploadSuccess = (uploaded: ResumeRecord) => {
    setJustUploadedResume(uploaded);
  };

  const graph = justUploadedResume?.parsedData;

  return (
    <div className="mx-auto text-foreground">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-6 border-b border-border">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Import Document
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {justUploadedResume ? "Ingestion complete" : "Add a resume"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {justUploadedResume
              ? "Your document is structured into your canonical resume graph."
              : "Ingest PDF or DOCX files into a single source of truth for all exports."}
          </p>
        </div>

        {justUploadedResume && (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer text-xs h-8 shrink-0"
            onClick={() => setJustUploadedResume(null)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Upload Another CV
          </Button>
        )}
      </div>

      <div className="pt-8">
        {!justUploadedResume ? (
          <div className="space-y-12">
            {/* Primary Action Area: Interactive Dropzone FIRST */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <ResumeUploader onUploadSuccess={handleUploadSuccess} />
            </div>

            {/* Secondary Context Area: How it works BELOW the dropzone */}
            <div className="pt-8 border-t border-border space-y-6">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  How FolioForge ingests your resume
                </h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Upload your master resume once. Our parsing engine extracts
                  every work milestone, skill tag, and credential into
                  structured PostgreSQL data.
                </p>
              </div>

              {/* 3-Step Process (Horizontal on desktop, vertical on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0 mt-0.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">
                      1. Ingest PDF or DOCX
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Accepts standard formats up to 10MB. Layout noise is
                      stripped clean.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">
                      2. Canonical Graph Extraction
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      AI maps bullets, contact URLs, and dates directly into
                      JSON schemas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">
                      3. Factual Truth Grounding
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Serves as the factual boundary for AI tailoring and
                      portfolio sites.
                    </p>
                  </div>
                </div>
              </div>

              {resumes.length > 0 && (
                <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    You currently have{" "}
                    <strong className="text-foreground font-semibold">
                      {resumes.length}
                    </strong>{" "}
                    master resume{resumes.length > 1 ? "s" : ""} on file.
                  </span>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
                  >
                    View active master CV <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Post-Upload Ingestion Success View */
          <div className="max-w-2xl space-y-8">
            {/* Status Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  &quot;{justUploadedResume.title}&quot; parsed successfully
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {justUploadedResume.originalFilename} •{" "}
                  {(justUploadedResume.fileSize / 1024).toFixed(1)} KB • Status:{" "}
                  <span className="font-medium text-emerald-600 capitalize">
                    {justUploadedResume.parsingStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Extracted Stats Bar */}
            {graph && (
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Extraction Breakdown
                </p>

                <div className="flex flex-wrap gap-8 py-4 px-5 rounded-xl border border-border/80 bg-muted/20">
                  <div>
                    <span className="text-2xl font-bold tracking-tight text-foreground block">
                      {graph.workExperiences?.length || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Work entries
                    </span>
                  </div>

                  <div
                    className="w-px h-10 bg-border/60 self-center hidden sm:block"
                    aria-hidden="true"
                  />

                  <div>
                    <span className="text-2xl font-bold tracking-tight text-foreground block">
                      {graph.skills?.length || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Skill tags
                    </span>
                  </div>

                  <div
                    className="w-px h-10 bg-border/60 self-center hidden sm:block"
                    aria-hidden="true"
                  />

                  <div>
                    <span className="text-2xl font-bold tracking-tight text-foreground block">
                      {graph.education?.length || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Education records
                    </span>
                  </div>

                  <div
                    className="w-px h-10 bg-border/60 self-center hidden sm:block"
                    aria-hidden="true"
                  />

                  <div>
                    <span className="text-2xl font-bold tracking-tight text-foreground block">
                      {graph.projects?.length || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Projects
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto cursor-pointer text-xs h-9 px-5 font-medium"
              >
                <FolderKanban className="w-3.5 h-3.5 mr-2" />
                Go to Master Resume Overview
              </Button>
              <Link to="/dashboard/tailor" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto cursor-pointer text-xs h-9 px-5"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  Tailor CV for Job Description
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
