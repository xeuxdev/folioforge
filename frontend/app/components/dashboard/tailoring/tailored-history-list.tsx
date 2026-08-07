import { Clock, Eye, FileCheck, History, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { TailoredRecord } from "~/hooks/use-tailor";

interface TailoredHistoryListProps {
  history: TailoredRecord[];
  activeId?: string | null;
  onSelectRecord: (record: TailoredRecord) => void;
  onRunAtsCheck: (record: TailoredRecord) => void;
  onDeleteRecord: (id: string) => void;
  isEvaluating?: boolean;
  isDeleting?: boolean;
}

export function TailoredHistoryList({
  history,
  activeId,
  onSelectRecord,
  onRunAtsCheck,
  onDeleteRecord,
  isEvaluating,
  isDeleting,
}: TailoredHistoryListProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-card border border-border p-6 rounded-2xl space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Saved Tailored Resumes ({history.length})
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Access past ATS resume tailoring sessions. Select any record to
            inspect bullet diffs, export PDF/DOCX, run ATS evaluation, or
            delete.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((record) => {
          const isActive = record.id === activeId;
          const matchCount = (record.matchedKeywords || []).length;
          const missingCount = (record.missingKeywords || []).length;
          const totalTerms = matchCount + missingCount;
          const is100Percent = missingCount === 0 && matchCount > 0;
          const formattedDate = new Date(record.createdAt).toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          );

          return (
            <div
              key={record.id}
              className={`p-4 rounded-xl border transition-all space-y-4 flex flex-col justify-between ${
                isActive
                  ? "bg-primary/5 border-primary/40 shadow-xs ring-1 ring-primary/20"
                  : "bg-muted/30 hover:bg-muted/60 border-border"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">
                    {record.targetRole}
                  </h4>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {matchCount}/{totalTerms} Terms
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteRecord(record.id)}
                      disabled={isDeleting}
                      title="Delete tailored resume"
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground line-clamp-1">
                  {record.targetCompany}
                </p>
                <div className="flex items-center space-x-1.5 text-[11px] text-muted-foreground font-mono">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
                <Button
                  variant={isActive ? "secondary" : "outline"}
                  size="xs"
                  onClick={() => onSelectRecord(record)}
                  className={`${is100Percent ? "w-full" : "w-1/2"} text-xs font-semibold cursor-pointer`}
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  {isActive ? "Loaded" : "Load Diff"}
                </Button>
                {!is100Percent && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onRunAtsCheck(record)}
                    disabled={isEvaluating}
                    className="w-1/2 text-xs font-semibold cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                    Run ATS Check
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
