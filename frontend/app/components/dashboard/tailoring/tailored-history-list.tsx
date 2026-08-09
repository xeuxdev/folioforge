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
    <div className="py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground shrink-0" />
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Saved Tailoring History ({history.length})
          </h3>
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Select any past session to load diffs or run ATS evaluation.
        </p>
      </div>

      {/* Clean list format */}
      <div className="divide-y divide-border/60">
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
              className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isActive ? "bg-muted/30 px-3 -mx-3 rounded-lg font-medium" : "hover:bg-muted/10 px-3 -mx-3 rounded-lg"
              }`}
            >
              {/* Info Column */}
              <div className="flex items-center gap-3 min-w-0">
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {record.targetRole}
                    </h4>
                    <span className="text-xs text-muted-foreground truncate">
                      at {record.targetCompany}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-emerald-600 font-medium">
                      {matchCount}/{totalTerms} Terms Matched
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSelectRecord(record)}
                  className="text-xs h-8 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  {isActive ? "Viewing" : "Load Diff"}
                </Button>

                {!is100Percent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRunAtsCheck(record)}
                    disabled={isEvaluating}
                    className="text-xs h-8 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                    ATS Check
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteRecord(record.id)}
                  disabled={isDeleting}
                  className="text-xs h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
