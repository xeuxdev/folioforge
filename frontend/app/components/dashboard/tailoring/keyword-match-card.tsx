import { useState } from "react";
import { CheckCircle2, AlertCircle, Plus, Eye } from "lucide-react";
import { Button } from "~/components/ui/button";

interface KeywordMatchCardProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  onAddMissingSkill?: (skill: string) => void;
  onOpenPreview?: () => void;
  onExport?: () => void;
}

export function KeywordMatchCard({
  matchedKeywords,
  missingKeywords,
  onAddMissingSkill,
  onOpenPreview,
}: KeywordMatchCardProps) {
  const [addedSkills, setAddedSkills] = useState<string[]>([]);

  const totalTerms = matchedKeywords.length + missingKeywords.length;
  const matchPercentage = Math.round(
    (matchedKeywords.length / (totalTerms || 1)) * 100,
  );

  const handleAddSkill = (skill: string) => {
    setAddedSkills((prev) => [...prev, skill]);
    if (onAddMissingSkill) {
      onAddMissingSkill(skill);
    }
  };

  return (
    <div className="py-6 border-b border-border space-y-6">
      {/* Top Match Score Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">
              ATS Keyword Match: {matchedKeywords.length} / {totalTerms} Terms ({matchPercentage}%)
            </h3>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              {matchPercentage}% Match
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Extracted requirements evaluated against your canonical master resume graph.
          </p>
        </div>

        {/* Action Button: Preview & Export */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onOpenPreview}
            className="text-xs h-8 px-3 font-medium cursor-pointer"
          >
            <Eye className="mr-1.5 w-3.5 h-3.5" />
            Preview & Export
          </Button>
        </div>
      </div>

      {/* Matched & Gap Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Column 1: Matched Keywords */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
              Matched Keywords ({matchedKeywords.length})
            </span>
            <span className="text-[11px] text-muted-foreground">
              Found in CV
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                >
                  <span className="w-1 h-1 rounded-full bg-emerald-600" aria-hidden="true" />
                  <span>{kw}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">No matching keywords found</span>
            )}
          </div>
        </div>

        {/* Column 2: Missing Keywords & Quick Add */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Missing / Gap Keywords ({missingKeywords.length})
            </span>
            <span className="text-[11px] text-muted-foreground">
              Click + to add
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((kw) => {
                const isAdded = addedSkills.includes(kw);
                return (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => !isAdded && handleAddSkill(kw)}
                    disabled={isAdded}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer border ${
                      isAdded
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    {isAdded ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Plus className="w-3 h-3 text-muted-foreground" />
                    )}
                    <span>{kw}</span>
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-muted-foreground italic">No keyword gaps detected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
