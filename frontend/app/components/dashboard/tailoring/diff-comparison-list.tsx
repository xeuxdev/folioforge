import { useState } from "react";
import {
  Check,
  X,
  Edit2,
  CheckCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
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

export function DiffComparisonList({
  diffs,
  onUpdateDiffs,
}: DiffComparisonListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

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
      {/* Header & Bulk Controls */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-foreground">
              Side-by-Side Impact Bullet Diff Viewer
            </h3>
            <span className="text-xs font-mono font-semibold bg-muted px-2 py-0.5 rounded border border-border">
              {acceptedCount} of {diffs.length} Approved
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare original experience bullets against AI tailored variations.
            Approve, reject, or edit line-by-line.
          </p>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <Button
            variant="outline"
            size="xs"
            onClick={handleResetAll}
            className="text-xs font-semibold"
          >
            <RotateCcw className="mr-1 w-3 h-3" />
            Reset All
          </Button>
          <Button
            variant="secondary"
            size="xs"
            onClick={handleAcceptAll}
            className="text-xs font-semibold"
          >
            <CheckCheck className="mr-1 w-3 h-3 text-emerald-600" />
            Approve All
          </Button>
        </div>
      </div>

      {/* Line-by-Line Diff Cards */}
      <div className="space-y-4">
        {diffs.map((diff) => {
          const isEditing = editingId === diff.id;
          return (
            <div
              key={diff.id}
              className={`bg-card border p-6 rounded-2xl space-y-4 transition-all shadow-xs ${
                diff.status === "accepted"
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : diff.status === "rejected"
                    ? "border-destructive/30 opacity-60"
                    : "border-border"
              }`}
            >
              {/* Role & Company Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">
                    {diff.company}
                  </span>
                  <span className="text-muted-foreground">&bull;</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {diff.role}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {diff.matchedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dual Column Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Original Master Bullet */}
                <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-2">
                  <span className="text-[10px] font-mono font-semibold uppercase text-muted-foreground tracking-wider">
                    Original Master Graph Bullet
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">
                    {diff.originalText}
                  </p>
                </div>

                {/* Column 2: Tailored Recommendation with Highlighting */}
                <div className="bg-card p-4 rounded-xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 tracking-wider">
                      Tailored Keyword Alignment
                    </span>
                    <button
                      type="button"
                      onClick={() => startEditing(diff)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Custom Edit</span>
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="text-xs"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button size="xs" onClick={() => saveEditing(diff.id)}>
                          Save & Approve
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-foreground leading-relaxed font-medium">
                      {diff.tailoredText}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Controls Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground font-mono flex items-center space-x-1">
                  <span>Status:</span>
                  <strong className="capitalize text-foreground">
                    {diff.status}
                  </strong>
                </span>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={
                      diff.status === "rejected" ? "destructive" : "outline"
                    }
                    size="xs"
                    onClick={() => handleStatusToggle(diff.id, "rejected")}
                  >
                    <X className="mr-1 w-3 h-3" />
                    Reject Original
                  </Button>
                  <Button
                    variant={diff.status === "accepted" ? "default" : "outline"}
                    size="xs"
                    onClick={() => handleStatusToggle(diff.id, "accepted")}
                  >
                    <Check className="mr-1 w-3 h-3" />
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
