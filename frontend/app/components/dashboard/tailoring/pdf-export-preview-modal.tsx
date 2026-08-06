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
  demoResumeData,
} from "~/lib/export-engine";

interface PdfExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleTitle: string;
  companyName: string;
}

export function PdfExportPreviewModal({
  isOpen,
  onClose,
  roleTitle,
  companyName,
}: PdfExportPreviewModalProps) {
  const [layoutMode, setLayoutMode] = useState<"single" | "multi">("single");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDocxExport = async () => {
    setIsExportingDocx(true);
    try {
      await downloadDocxResume({
        ...demoResumeData,
        roleTitle: roleTitle || demoResumeData.roleTitle,
      });
    } catch (err) {
      console.error("DOCX generation error:", err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePdfExport = () => {
    downloadPdfResume({
      ...demoResumeData,
      roleTitle: roleTitle || demoResumeData.roleTitle,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between bg-muted/40">
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
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="px-6 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs bg-card">
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

        {/* Live Vector Document Canvas Sheet Preview */}
        <div className="flex-1 p-6 bg-muted/60 overflow-y-auto flex justify-center">
          <div
            className="bg-white text-stone-900 shadow-lg rounded-sm p-8 sm:p-12 w-full max-w-2xl min-h-187.5 space-y-6 font-sans border border-stone-200 transition-all transform origin-top"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* PDF Resume Header */}
            <div className="border-b border-stone-300 pb-4 text-center space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 uppercase">
                {demoResumeData.fullName}
              </h1>
              <p className="text-xs font-semibold text-stone-700">
                {roleTitle} &bull; San Francisco, CA &bull;{" "}
                {demoResumeData.email} &bull; alexmorgan.dev
              </p>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                Executive Summary
              </h2>
              <p className="text-xs text-stone-700 leading-relaxed">
                {demoResumeData.summary}
              </p>
            </div>

            {/* Work Experience Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                Work Experience
              </h2>

              {demoResumeData.experience.map((exp, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-baseline text-xs font-bold text-stone-900">
                    <span>
                      {exp.company} — {exp.role}
                    </span>
                    <span className="font-mono text-[11px] text-stone-600">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-stone-700 space-y-1.5 leading-relaxed">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Technical Skills Section */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-1">
                Technical Skills & Core Competencies
              </h2>
              <p className="text-xs text-stone-700 leading-relaxed font-mono">
                {demoResumeData.skills.join(" • ")}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer & Export Actions */}
        <div className="p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/40">
          <div className="flex items-center space-x-2 text-xs text-emerald-600   font-semibold">
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
