import { useState } from "react";
import { JobIngestionForm } from "./tailoring/job-ingestion-form";
import { KeywordMatchCard } from "./tailoring/keyword-match-card";
import {
  DiffComparisonList,
  type BulletDiffItem,
} from "./tailoring/diff-comparison-list";
import { PdfExportPreviewModal } from "./tailoring/pdf-export-preview-modal";
import { TailoredHistoryList } from "./tailoring/tailored-history-list";
import { useTailor, type TailoredRecord } from "~/hooks/use-tailor";
import { useResumes } from "~/hooks/use-resumes";
import {
  Loader2,
  AlertCircle,
  Sparkles,
  FileCheck,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "~/components/ui/button";

export function AiTailorDiffViewer() {
  const { resumes } = useResumes();
  const {
    history,
    analyzeJob,
    isAnalyzing,
    evaluateAtsCheck,
    isEvaluatingAts,
    updateTailoredRecord,
    deleteTailoredRecord,
    isDeleting,
    downloadDocx,
  } = useTailor();

  const [activeRecord, setActiveRecord] = useState<TailoredRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const activeMasterResume = resumes.length > 0 ? resumes[0] : null;

  const isActiveRecord100Percent =
    activeRecord &&
    (activeRecord.missingKeywords || []).length === 0 &&
    (activeRecord.matchedKeywords || []).length > 0;

  const handleAnalyzeJob = async (
    jdText: string,
    newRoleTitle: string,
    newCompanyName: string,
  ) => {
    setErrorMessage(null);
    try {
      const record = await analyzeJob({
        masterResumeId: activeMasterResume?.id,
        targetRole: newRoleTitle || "Senior Full-Stack Engineer",
        targetCompany: newCompanyName || "Target Company",
        jobDescription: jdText,
      });
      setActiveRecord(record);
      setTimeout(() => {
        const el = document.getElementById("active-analysis-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("Job analysis error:", err);
      const apiErr = err as {
        message?: string;
        errorData?: { message?: string };
      };
      const msg =
        apiErr?.errorData?.message ||
        apiErr?.message ||
        "Failed to generate AI tailoring via LLM. Please verify server OpenAI credentials.";
      setErrorMessage(msg);
    }
  };

  const handleRunAtsCheck = async (recordToCheck: TailoredRecord) => {
    try {
      const updatedRecord = await evaluateAtsCheck({ id: recordToCheck.id });
      setActiveRecord(updatedRecord);
    } catch (err) {
      console.error("ATS check error:", err);
    }
  };

  const handleSelectHistoryRecord = (record: TailoredRecord) => {
    setActiveRecord(record);
    setTimeout(() => {
      const el = document.getElementById("active-analysis-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleDeleteRecord = async (id: string) => {
    await deleteTailoredRecord(id);
    if (activeRecord?.id === id) {
      setActiveRecord(null);
    }
  };

  const handleAddMissingSkill = async (skill: string) => {
    if (!activeRecord) return;
    const newMatched = [...activeRecord.matchedKeywords, skill];
    const newMissing = activeRecord.missingKeywords.filter((k) => k !== skill);

    setActiveRecord((prev) =>
      prev
        ? {
            ...prev,
            matchedKeywords: newMatched,
            missingKeywords: newMissing,
          }
        : null,
    );

    await updateTailoredRecord({
      id: activeRecord.id,
      matchedKeywords: newMatched,
      missingKeywords: newMissing,
    });
  };

  const handleUpdateDiffs = async (newDiffs: BulletDiffItem[]) => {
    if (!activeRecord) return;

    // Extract any new keywords matched from newly accepted diffs
    const newlyAccepted = newDiffs.filter((d) => d.status === "accepted");
    const newlyMatchedKeywords = Array.from(
      new Set(newlyAccepted.flatMap((d) => d.matchedKeywords || [])),
    );
    const updatedMatched = Array.from(
      new Set([...activeRecord.matchedKeywords, ...newlyMatchedKeywords]),
    );
    const updatedMissing = activeRecord.missingKeywords.filter(
      (k) => !updatedMatched.includes(k),
    );

    setActiveRecord((prev) =>
      prev
        ? {
            ...prev,
            bulletDiffs: newDiffs,
            matchedKeywords: updatedMatched,
            missingKeywords: updatedMissing,
          }
        : null,
    );

    await updateTailoredRecord({
      id: activeRecord.id,
      bulletDiffs: newDiffs,
      matchedKeywords: updatedMatched,
      missingKeywords: updatedMissing,
    });
  };

  const handleDocxExport = async () => {
    if (!activeRecord) return;
    const filename =
      `${activeRecord.targetCompany}_${activeRecord.targetRole}_Tailored.docx`.replace(
        /[^a-z0-9_.]/gi,
        "_",
      );
    await downloadDocx(activeRecord.id, filename);
  };

  return (
    <div className="space-y-8">
      {/* STEP 1: Primary Job Ingestion Form */}
      <JobIngestionForm
        onAnalyze={handleAnalyzeJob}
        isProcessing={isAnalyzing}
      />

      {/* Error Alert Notification */}
      {errorMessage && (
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold">AI Tailoring Error</h4>
            <p className="text-xs opacity-90 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border text-center text-muted-foreground space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">
            Ingesting job description & processing LLM tailoring...
          </p>
        </div>
      )}

      {/* STEP 2: Active Tailoring Analysis Results & Bullet Diff Viewer */}
      {activeRecord && !isAnalyzing && (
        <div id="active-analysis-section" className="space-y-6 pt-2">
          {/* Active Record Controls Banner */}
          <div className="bg-muted/40 border border-border p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Active Tailored Result: {activeRecord.targetRole}
                  </h3>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {activeRecord.targetCompany}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspecting matched keywords and line-by-line bullet
                  optimizations.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {isActiveRecord100Percent ? (
                <span className="inline-flex items-center text-xs font-semibold font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  100% ATS Matched
                </span>
              ) : (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleRunAtsCheck(activeRecord)}
                  disabled={isEvaluatingAts}
                  className="text-xs font-semibold cursor-pointer"
                >
                  <FileCheck
                    className={`w-3.5 h-3.5 mr-1.5 text-primary ${
                      isEvaluatingAts ? "animate-spin" : ""
                    }`}
                  />
                  {isEvaluatingAts ? "Re-checking ATS..." : "Run ATS Check"}
                </Button>
              )}

              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleDeleteRecord(activeRecord.id)}
                disabled={isDeleting}
                className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                title="Delete tailored resume"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <KeywordMatchCard
            matchedKeywords={activeRecord.matchedKeywords}
            missingKeywords={activeRecord.missingKeywords}
            onAddMissingSkill={handleAddMissingSkill}
            onOpenPreview={() => setIsExportModalOpen(true)}
            onExport={() => setIsExportModalOpen(true)}
          />

          <DiffComparisonList
            diffs={activeRecord.bulletDiffs}
            onUpdateDiffs={handleUpdateDiffs}
          />
        </div>
      )}

      {/* STEP 3: Saved Tailored Resumes History (Placed at the bottom) */}
      {history && history.length > 0 && (
        <div className="pt-4 border-t border-border">
          <TailoredHistoryList
            history={history}
            activeId={activeRecord?.id}
            onSelectRecord={handleSelectHistoryRecord}
            onRunAtsCheck={handleRunAtsCheck}
            onDeleteRecord={handleDeleteRecord}
            isEvaluating={isEvaluatingAts}
            isDeleting={isDeleting}
          />
        </div>
      )}

      {/* Live PDF & DOCX Export Preview Modal */}
      {activeRecord && (
        <PdfExportPreviewModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          roleTitle={activeRecord.targetRole}
          companyName={activeRecord.targetCompany}
          resumeGraph={activeMasterResume?.parsedData}
          bulletDiffs={activeRecord.bulletDiffs}
          onExportDocx={handleDocxExport}
        />
      )}
    </div>
  );
}
