import { useState, useEffect } from "react";
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
  Pencil,
  Save,
  Check,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingRecord, setIsSavingRecord] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editedRole, setEditedRole] = useState<string>("");
  const [editedCompany, setEditedCompany] = useState<string>("");
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [titleSaveSuccess, setTitleSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (activeRecord) {
      setEditedRole(activeRecord.targetRole);
      setEditedCompany(activeRecord.targetCompany);
      setIsEditingTitle(false);
    }
  }, [activeRecord?.id]);

  const activeMasterResume = resumes.length > 0 ? resumes[0] : null;

  const isActiveRecord100Percent =
    activeRecord &&
    (activeRecord.missingKeywords || []).length === 0 &&
    (activeRecord.matchedKeywords || []).length > 0;

  const handleSaveTitle = async () => {
    if (!activeRecord) return;
    const roleToSave = editedRole.trim() || activeRecord.targetRole;
    const companyToSave = editedCompany.trim() || activeRecord.targetCompany;

    setIsSavingTitle(true);
    try {
      const updated = await updateTailoredRecord({
        id: activeRecord.id,
        targetRole: roleToSave,
        targetCompany: companyToSave,
      });
      setActiveRecord(updated);
      setIsEditingTitle(false);
      setTitleSaveSuccess(true);
      setTimeout(() => setTitleSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update title:", err);
    } finally {
      setIsSavingTitle(false);
    }
  };

  const handleExplicitSaveRecord = async () => {
    if (!activeRecord) return;
    setIsSavingRecord(true);
    try {
      const updated = await updateTailoredRecord({
        id: activeRecord.id,
        targetRole: activeRecord.targetRole,
        targetCompany: activeRecord.targetCompany,
        matchedKeywords: activeRecord.matchedKeywords,
        missingKeywords: activeRecord.missingKeywords,
        bulletDiffs: activeRecord.bulletDiffs,
      });
      setActiveRecord(updated);
      setToastMessage("Tailored resume saved and master resumes updated!");
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    } catch (err) {
      console.error("Failed to save tailored record:", err);
    } finally {
      setIsSavingRecord(false);
    }
  };

  const handleAnalyzeJob = async (
    jdText: string,
    newRoleTitle: string,
    newCompanyName: string,
  ) => {
    setErrorMessage(null);
    try {
      const record = await analyzeJob({
        masterResumeId: activeMasterResume?.id,
        targetRole: newRoleTitle.trim(),
        targetCompany: newCompanyName.trim(),
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
        "Failed to generate AI tailoring via LLM. Please verify server credentials.";
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
    <div className="space-y-8 relative">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-foreground text-background shadow-lg border border-border transition-all animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-background/70 hover:text-background transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* STEP 1: Job Ingestion Form */}
      <JobIngestionForm
        onAnalyze={handleAnalyzeJob}
        isProcessing={isAnalyzing}
      />

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wide">AI Tailoring Error</h4>
            <p className="text-xs opacity-90 leading-relaxed mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Processing Loader */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-foreground" />
          <p className="text-sm font-medium text-foreground">
            Analyzing job requirements & running LLM tailoring engine...
          </p>
        </div>
      )}

      {/* STEP 2: Active Results Analysis & Bullet Diffs */}
      {activeRecord && !isAnalyzing && (
        <div id="active-analysis-section" className="space-y-8 pt-2">
          {/* Active Record Title & Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                {isEditingTitle ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Input
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value)}
                      placeholder="Target Role Title"
                      className="h-8 text-xs font-semibold max-w-xs"
                      aria-label="Target Role Title"
                    />
                    <Input
                      value={editedCompany}
                      onChange={(e) => setEditedCompany(e.target.value)}
                      placeholder="Company Name"
                      className="h-8 text-xs max-w-xs"
                      aria-label="Target Company Name"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        onClick={handleSaveTitle}
                        disabled={isSavingTitle}
                        className="text-xs h-8 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        {isSavingTitle ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingTitle(false);
                          setEditedRole(activeRecord.targetRole);
                          setEditedCompany(activeRecord.targetCompany);
                        }}
                        className="text-xs h-8 cursor-pointer"
                        aria-label="Cancel editing title"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-foreground truncate">
                        {activeRecord.targetRole}
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium">
                        at {activeRecord.targetCompany}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingTitle(true)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Edit Role & Company"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      {titleSaveSuccess && (
                        <span className="inline-flex items-center text-xs text-emerald-600 font-medium">
                          <Check className="w-3.5 h-3.5 mr-1" /> Saved
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reviewing keyword matches and line-by-line bullet optimizations.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {/* Primary Save Button */}
              <Button
                variant="default"
                size="sm"
                onClick={handleExplicitSaveRecord}
                disabled={isSavingRecord}
                className="text-xs h-8 font-medium cursor-pointer"
              >
                {isSavingRecord ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save Tailored Resume
                  </>
                )}
              </Button>

              {isActiveRecord100Percent ? (
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  100% ATS Matched
                </span>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRunAtsCheck(activeRecord)}
                  disabled={isEvaluatingAts}
                  className="text-xs h-8 font-medium cursor-pointer"
                >
                  <FileCheck
                    className={`w-3.5 h-3.5 mr-1.5 text-foreground ${
                      isEvaluatingAts ? "animate-spin" : ""
                    }`}
                  />
                  {isEvaluatingAts ? "Evaluating..." : "Run ATS Check"}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteRecord(activeRecord.id)}
                disabled={isDeleting}
                className="text-xs h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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

      {/* STEP 3: Saved History */}
      {history && history.length > 0 && (
        <TailoredHistoryList
          history={history}
          activeId={activeRecord?.id}
          onSelectRecord={handleSelectHistoryRecord}
          onRunAtsCheck={handleRunAtsCheck}
          onDeleteRecord={handleDeleteRecord}
          isEvaluating={isEvaluatingAts}
          isDeleting={isDeleting}
        />
      )}

      {/* PDF & DOCX Export Preview Modal */}
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
