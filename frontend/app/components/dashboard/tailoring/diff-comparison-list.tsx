import { useState } from "react";
import {
  Check,
  X,
  Edit2,
  CheckCheck,
  RotateCcw,
  GitCommit,
  Columns,
  AlignJustify,
  FileDiff,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export interface BulletDiffItem {
  id: string;
  role: string;
  company: string;
  originalText: string;
  tailoredText: string;
  addedPhrase: string;
  removedPhrase?: string;
  matchedKeywords: string[];
  status: "accepted" | "rejected" | "pending";
}

interface DiffComparisonListProps {
  diffs: BulletDiffItem[];
  onUpdateDiffs: (diffs: BulletDiffItem[]) => void;
}

interface DiffChunk {
  type: "added" | "removed" | "unchanged";
  value: string;
}

function computeWordDiff(
  original: string,
  tailored: string,
): { originalChunks: DiffChunk[]; tailoredChunks: DiffChunk[] } {
  const origWords = original.split(/(\s+)/);
  const tailWords = tailored.split(/(\s+)/);

  const n = origWords.length;
  const m = tailWords.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0),
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (origWords[i - 1] === tailWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = n;
  let j = m;
  const origChunks: DiffChunk[] = [];
  const tailChunks: DiffChunk[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origWords[i - 1] === tailWords[j - 1]) {
      origChunks.unshift({ type: "unchanged", value: origWords[i - 1] });
      tailChunks.unshift({ type: "unchanged", value: tailWords[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tailChunks.unshift({ type: "added", value: tailWords[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      origChunks.unshift({ type: "removed", value: origWords[i - 1] });
      i--;
    }
  }

  return { originalChunks: origChunks, tailoredChunks: tailChunks };
}

export function DiffComparisonList({
  diffs,
  onUpdateDiffs,
}: DiffComparisonListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");

  const acceptedCount = diffs.filter((d) => d.status === "accepted").length;

  const handleStatusToggle = (
    id: string,
    newStatus: "accepted" | "rejected",
  ) => {
    onUpdateDiffs(
      diffs.map((d) =>
        d.id === id
          ? { ...d, status: d.status === newStatus ? "pending" : newStatus }
          : d,
      ),
    );
  };

  const handleAcceptAll = () => {
    onUpdateDiffs(diffs.map((d) => ({ ...d, status: "accepted" })));
  };

  const handleResetAll = () => {
    onUpdateDiffs(diffs.map((d) => ({ ...d, status: "pending" })));
  };

  const startEditing = (diff: BulletDiffItem) => {
    setEditingId(diff.id);
    setEditText(diff.tailoredText);
  };

  const saveEditing = (id: string) => {
    onUpdateDiffs(
      diffs.map((d) =>
        d.id === id ? { ...d, tailoredText: editText, status: "accepted" } : d,
      ),
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* GitHub-style Diff Control Bar Header */}
      <div className="bg-card border border-border p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <FileDiff className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              GitHub Bullet Point Diff Inspector
            </h3>
            <span className="text-xs font-mono font-semibold bg-muted px-2.5 py-0.5 rounded-full border border-border">
              {acceptedCount} / {diffs.length} Approved
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Review line-by-line experience enhancements. Green indicates ATS keywords added; red indicates original text replaced.
          </p>
        </div>

        {/* View Mode & Bulk Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Split / Unified View Selector */}
          <div className="flex items-center bg-muted p-1 rounded-lg border border-border space-x-1">
            <Button
              type="button"
              variant={viewMode === "split" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("split")}
              className="text-xs font-mono font-medium h-7 px-2 cursor-pointer"
              title="Side-by-Side Split Diff View"
              aria-label="Side-by-Side Split Diff View"
            >
              <Columns className="w-3.5 h-3.5 mr-1" /> Split
            </Button>
            <Button
              type="button"
              variant={viewMode === "unified" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setViewMode("unified")}
              className="text-xs font-mono font-medium h-7 px-2 cursor-pointer"
              title="Unified Inline Diff View"
              aria-label="Unified Inline Diff View"
            >
              <AlignJustify className="w-3.5 h-3.5 mr-1" /> Unified
            </Button>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={handleResetAll}
            className="text-xs font-semibold h-8 cursor-pointer"
          >
            <RotateCcw className="mr-1.5 w-3.5 h-3.5" /> Reset
          </Button>

          <Button
            variant="secondary"
            size="xs"
            onClick={handleAcceptAll}
            className="text-xs font-semibold h-8 cursor-pointer"
          >
            <CheckCheck className="mr-1.5 w-3.5 h-3.5 text-emerald-600" /> Approve All
          </Button>
        </div>
      </div>

      {/* Diff Cards List */}
      <div className="space-y-5">
        {diffs.map((diff, index) => {
          const isEditing = editingId === diff.id;
          const { originalChunks, tailoredChunks } = computeWordDiff(
            diff.originalText,
            diff.tailoredText,
          );

          return (
            <div
              key={diff.id}
              className={`rounded-2xl border transition-all overflow-hidden shadow-xs bg-card ${
                diff.status === "accepted"
                  ? "border-emerald-500/50"
                  : diff.status === "rejected"
                    ? "border-destructive/40 opacity-80"
                    : "border-border"
              }`}
            >
              {/* GitHub File-Style Title Bar Header */}
              <div className="bg-muted/80 border-b border-border px-4 py-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <GitCommit className="w-4 h-4 text-foreground shrink-0" />
                  <span className="font-bold text-foreground text-sm truncate">
                    {diff.company}
                  </span>
                  <span className="text-muted-foreground font-bold">&bull;</span>
                  <span className="text-foreground font-semibold truncate">
                    {diff.role}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    (#bullet-{index + 1})
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {diff.matchedKeywords.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {diff.matchedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
                        >
                          +{kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status Badge */}
                  {diff.status === "accepted" ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700 dark:text-emerald-400" /> Approved
                    </span>
                  ) : diff.status === "rejected" ? (
                    <span className="inline-flex items-center text-xs font-bold text-red-950 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800">
                      <XCircle className="w-3.5 h-3.5 mr-1 text-red-700 dark:text-red-400" /> Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800">
                      <Clock className="w-3.5 h-3.5 mr-1 text-amber-700 dark:text-amber-400" /> Pending Review
                    </span>
                  )}
                </div>
              </div>

              {/* Diff Code Container Body */}
              <div className="p-4 space-y-4">
                {isEditing ? (
                  /* Custom Inline Editor Mode */
                  <div className="space-y-3 p-3.5 bg-muted/40 rounded-xl border border-border">
                    <span className="text-xs font-bold text-foreground block">
                      Edit Tailored Bullet Point Text:
                    </span>
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="text-xs font-mono text-foreground font-medium"
                      aria-label="Edit Tailored Bullet Text"
                    />
                    <div className="flex justify-end space-x-2 pt-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setEditingId(null)}
                        className="text-xs cursor-pointer font-medium"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => saveEditing(diff.id)}
                        className="text-xs font-bold cursor-pointer"
                      >
                        Save & Approve
                      </Button>
                    </div>
                  </div>
                ) : viewMode === "split" ? (
                  /* GitHub Split (Side-by-Side) Diff View */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column: Original Master Bullet (-) */}
                    <div className="rounded-xl border border-red-200 dark:border-red-900/60 overflow-hidden bg-card shadow-xs">
                      <div className="bg-red-100 dark:bg-red-950/80 px-3.5 py-2 border-b border-red-200 dark:border-red-900/60 flex items-center justify-between text-xs font-mono font-bold text-red-950 dark:text-red-200">
                        <span className="flex items-center">
                          <span className="mr-1.5 font-black text-red-700 dark:text-red-400">-</span> Master Graph Bullet
                        </span>
                        <span className="text-[11px] opacity-90">LINE -1</span>
                      </div>
                      <div className="p-4 text-xs sm:text-sm leading-relaxed text-foreground font-mono whitespace-pre-wrap bg-red-50/20 dark:bg-red-950/10">
                        {originalChunks.map((chunk, cIdx) =>
                          chunk.type === "removed" ? (
                            chunk.value.trim() === "" ? (
                              chunk.value
                            ) : (
                              <mark
                                key={cIdx}
                                className="bg-red-200 text-red-950 font-bold line-through px-1 py-0.5 rounded border border-red-300 dark:bg-red-900/80 dark:text-red-100 dark:border-red-700"
                              >
                                {chunk.value}
                              </mark>
                            )
                          ) : (
                            <span key={cIdx}>{chunk.value}</span>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Right Column: Tailored Recommendation (+) */}
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 overflow-hidden bg-card shadow-xs">
                      <div className="bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-2 border-b border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs font-mono font-bold text-emerald-950 dark:text-emerald-200">
                        <span className="flex items-center">
                          <span className="mr-1.5 font-black text-emerald-700 dark:text-emerald-400">+</span> Tailored ATS Recommendation
                          <Sparkles className="w-3.5 h-3.5 ml-1.5 text-emerald-700 dark:text-emerald-400" />
                        </span>
                        <span className="text-[11px] opacity-90">LINE +1</span>
                      </div>
                      <div className="p-4 text-xs sm:text-sm leading-relaxed text-foreground font-mono whitespace-pre-wrap bg-emerald-50/20 dark:bg-emerald-950/10">
                        {tailoredChunks.map((chunk, cIdx) =>
                          chunk.type === "added" ? (
                            chunk.value.trim() === "" ? (
                              chunk.value
                            ) : (
                              <mark
                                key={cIdx}
                                className="bg-emerald-200 text-emerald-950 font-bold px-1 py-0.5 rounded border border-emerald-300 dark:bg-emerald-900/80 dark:text-emerald-100 dark:border-emerald-700"
                              >
                                {chunk.value}
                              </mark>
                            )
                          ) : (
                            <span key={cIdx}>{chunk.value}</span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* GitHub Unified (Inline) Diff View */
                  <div className="rounded-xl border border-border overflow-hidden font-mono text-xs divide-y divide-border shadow-xs">
                    {/* Line 1: Deletion (-) */}
                    <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 leading-relaxed text-foreground flex items-start space-x-2.5">
                      <span className="text-red-700 dark:text-red-400 font-black shrink-0 select-none">
                        -
                      </span>
                      <div className="whitespace-pre-wrap flex-1">
                        {originalChunks.map((chunk, cIdx) =>
                          chunk.type === "removed" ? (
                            chunk.value.trim() === "" ? (
                              chunk.value
                            ) : (
                              <mark
                                key={cIdx}
                                className="bg-red-200 text-red-950 font-bold line-through px-1 py-0.5 rounded border border-red-300 dark:bg-red-900/80 dark:text-red-100 dark:border-red-700"
                              >
                                {chunk.value}
                              </mark>
                            )
                          ) : (
                            <span key={cIdx}>{chunk.value}</span>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Line 2: Addition (+) */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 p-4 leading-relaxed text-foreground flex items-start space-x-2.5">
                      <span className="text-emerald-700 dark:text-emerald-400 font-black shrink-0 select-none">
                        +
                      </span>
                      <div className="whitespace-pre-wrap flex-1">
                        {tailoredChunks.map((chunk, cIdx) =>
                          chunk.type === "added" ? (
                            chunk.value.trim() === "" ? (
                              chunk.value
                            ) : (
                              <mark
                                key={cIdx}
                                className="bg-emerald-200 text-emerald-950 font-bold px-1 py-0.5 rounded border border-emerald-300 dark:bg-emerald-900/80 dark:text-emerald-100 dark:border-emerald-700"
                              >
                                {chunk.value}
                              </mark>
                            )
                          ) : (
                            <span key={cIdx}>{chunk.value}</span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* GitHub PR Review Footer Controls */}
              <div className="bg-muted/40 border-t border-border px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => startEditing(diff)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer h-8 px-2.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit Bullet
                  </Button>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                  <Button
                    variant={
                      diff.status === "rejected" ? "destructive" : "outline"
                    }
                    size="xs"
                    onClick={() => handleStatusToggle(diff.id, "rejected")}
                    className="text-xs font-bold cursor-pointer h-8 px-3.5"
                  >
                    <X className="mr-1.5 w-3.5 h-3.5" />
                    Reject Original
                  </Button>
                  <Button
                    variant={diff.status === "accepted" ? "default" : "outline"}
                    size="xs"
                    onClick={() => handleStatusToggle(diff.id, "accepted")}
                    className={`text-xs font-bold cursor-pointer h-8 px-3.5 ${
                      diff.status === "accepted"
                        ? "bg-emerald-700 hover:bg-emerald-800 text-white border-transparent shadow-xs"
                        : ""
                    }`}
                  >
                    <Check className="mr-1.5 w-3.5 h-3.5" />
                    Approve & Merge
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

