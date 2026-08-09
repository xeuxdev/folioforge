import { useState } from "react";
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  downloadDocxResume,
  downloadPdfResume,
  buildExportDataFromGraph,
} from "~/lib/export-engine";
import type { CanonicalResumeGraph } from "~/types/resume";
import type { BulletDiffItem } from "./diff-comparison-list";

interface PdfExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleTitle: string;
  companyName: string;
  resumeGraph?: CanonicalResumeGraph | null;
  bulletDiffs?: BulletDiffItem[];
  onExportDocx?: () => Promise<void>;
}

export function PdfExportPreviewModal({
  isOpen,
  onClose,
  roleTitle,
  companyName,
  resumeGraph,
  bulletDiffs,
  onExportDocx,
}: PdfExportPreviewModalProps) {
  const [layoutMode, setLayoutMode] = useState<"single" | "multi">("single");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  if (!isOpen) return null;

  const exportData = buildExportDataFromGraph(
    resumeGraph,
    bulletDiffs,
    roleTitle,
    companyName
  );

  const handleDocxExport = async () => {
    setIsExportingDocx(true);
    try {
      if (onExportDocx) {
        await onExportDocx();
      } else {
        await downloadDocxResume(exportData);
      }
    } catch (err) {
      console.error("DOCX generation error:", err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePdfExport = () => {
    downloadPdfResume(exportData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-card border border-border rounded-2xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-foreground" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                ATS Vector PDF & DOCX Export Preview
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Targeted for:{" "}
              <strong className="text-foreground">{roleTitle}</strong> at{" "}
              <strong className="text-foreground">{companyName}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="px-6 py-2.5 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs bg-card shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground font-mono">
              Layout Mode:
            </span>
            <Button
              variant={layoutMode === "single" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setLayoutMode("single")}
            >
              1-Page ATS Strict
            </Button>
            <Button
              variant={layoutMode === "multi" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setLayoutMode("multi")}
            >
              Multi-Page Detailed
            </Button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setZoomLevel((prev) => Math.max(75, prev - 10))}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="font-mono text-[11px] w-12 text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setZoomLevel((prev) => Math.min(125, prev + 10))}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Live Vector Document Canvas Sheet Preview Container */}
        <div className="flex-1 p-4 sm:p-8 bg-muted/60 overflow-y-auto flex flex-col items-center min-h-0">
          <div
            className="w-full max-w-2xl bg-white text-stone-900 shadow-xl rounded-sm p-8 sm:p-12 space-y-6 font-sans border border-stone-200 transition-all origin-top my-2"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* PDF Resume Header */}
            <div className="border-b border-stone-300 pb-4 text-center space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 uppercase">
                {exportData.fullName}
              </h1>
              <p className="text-xs font-semibold text-stone-700">
                {[
                  roleTitle,
                  exportData.location,
                  exportData.email,
                  exportData.phone,
                  exportData.portfolioUrl,
                  exportData.linkedinUrl,
                  exportData.githubUrl,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>

            {/* Professional Summary */}
            {exportData.summary && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Executive Summary
                </h2>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {exportData.summary}
                </p>
              </div>
            )}

            {/* Work Experience Section */}
            {exportData.experience.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Work Experience
                </h2>

                {exportData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-bold text-stone-900">
                      <span>
                        {exp.company} — {exp.role}
                      </span>
                      {exp.period && (
                        <span className="font-mono text-[11px] text-stone-600">
                          {exp.period}
                        </span>
                      )}
                    </div>
                    <ul className="list-disc pl-4 text-xs text-stone-700 space-y-1.5 leading-relaxed">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Technical Skills Section */}
            {exportData.skills.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Technical Skills & Core Competencies
                </h2>
                <p className="text-xs text-stone-700 leading-relaxed font-mono">
                  {exportData.skills.join(" • ")}
                </p>
              </div>
            )}

            {/* Featured Projects Section */}
            {exportData.projects && exportData.projects.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Featured Projects
                </h2>
                {exportData.projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-xs font-bold text-stone-900">
                      {proj.title}
                      {proj.technologies.length > 0 && (
                        <span className="font-normal italic text-stone-600 font-mono text-[11px] ml-1">
                          ({proj.technologies.join(" • ")})
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {exportData.education.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Education
                </h2>
                {exportData.education.map((edu, idx) => (
                  <p key={idx} className="text-xs text-stone-700 leading-relaxed">
                    <strong>{edu.degree}</strong>
                    {edu.institution ? ` — ${edu.institution}` : ""}
                    {edu.year ? ` (${edu.year})` : ""}
                  </p>
                ))}
              </div>
            )}

            {/* Community Contributions & Leadership Section */}
            {exportData.communityContributions &&
              exportData.communityContributions.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                    Community Contributions & Leadership
                  </h2>
                  {exportData.communityContributions.map((comm, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs text-stone-700">
                      <div className="font-bold text-stone-900">
                        {comm.role}
                        {comm.organization ? ` at ${comm.organization}` : ""}
                        {comm.period ? (
                          <span className="font-normal font-mono text-[11px] text-stone-600 ml-1">
                            ({comm.period})
                          </span>
                        ) : null}
                      </div>
                      {comm.description && (
                        <p className="text-stone-700 leading-relaxed">
                          {comm.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            {/* Certifications Section */}
            {exportData.certifications && exportData.certifications.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Certifications
                </h2>
                {exportData.certifications.map((c, idx) => (
                  <p key={idx} className="text-xs text-stone-700 leading-relaxed">
                    <strong>{c.name}</strong>
                    {c.issuer ? ` — ${c.issuer}` : ""}
                    {c.issueDate ? ` (${c.issueDate})` : ""}
                  </p>
                ))}
              </div>
            )}

            {/* Languages Section */}
            {exportData.languages && exportData.languages.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Languages
                </h2>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {exportData.languages
                    .map((l) => (l.fluency ? `${l.language} (${l.fluency})` : l.language))
                    .join(" • ")}
                </p>
              </div>
            )}

            {/* Publications Section */}
            {exportData.publications && exportData.publications.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Publications
                </h2>
                {exportData.publications.map((pub, idx) => (
                  <p key={idx} className="text-xs text-stone-700 leading-relaxed">
                    <strong>{pub.title}</strong>
                    {pub.publisher ? ` — ${pub.publisher}` : ""}
                    {pub.publicationDate ? ` (${pub.publicationDate})` : ""}
                  </p>
                ))}
              </div>
            )}

            {/* Honors & Awards Section */}
            {exportData.honorsAndAwards && exportData.honorsAndAwards.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                  Honors & Awards
                </h2>
                {exportData.honorsAndAwards.map((award, idx) => (
                  <p key={idx} className="text-xs text-stone-700 leading-relaxed">
                    <strong>{award.title}</strong>
                    {award.issuer ? ` — ${award.issuer}` : ""}
                    {award.date ? ` (${award.date})` : ""}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer & Export Actions */}
        <div className="p-4 sm:p-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/40 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% ATS Vector Parseable &bull; Zero Raster Fonts</span>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDocxExport}
              disabled={isExportingDocx}
              className="text-xs font-semibold cursor-pointer"
            >
              {isExportingDocx ? (
                <>
                  <Loader2 className="mr-1.5 w-3.5 h-3.5 animate-spin" />
                  Generating DOCX...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-1.5 w-3.5 h-3.5" />
                  Download DOCX Word File
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={handlePdfExport}
              className="text-xs font-semibold cursor-pointer"
            >
              <Download className="mr-1.5 w-3.5 h-3.5" />
              Download ATS Vector PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
