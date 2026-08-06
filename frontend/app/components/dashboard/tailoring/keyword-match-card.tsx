import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { downloadDocxResume, downloadPdfResume } from "~/lib/export-engine";

interface KeywordMatchCardProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  onAddMissingSkill?: (skill: string) => void;
}

export function KeywordMatchCard({
  matchedKeywords,
  missingKeywords,
  onAddMissingSkill,
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
    <div className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-xs">
      {/* Top Match Score Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <h3 className="text-lg font-bold text-foreground">
              ATS Keyword Match Score: {matchedKeywords.length} / {totalTerms}{" "}
              Terms ({matchPercentage}%)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Extracted requirements from job description evaluated against your
            master canonical resume graph.
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadDocxResume()}
            className="text-xs font-semibold cursor-pointer"
          >
            <FileSpreadsheet className="mr-1.5 w-3.5 h-3.5" />
            Export DOCX
          </Button>
          <Button
            size="sm"
            onClick={() => downloadPdfResume()}
            className="text-xs font-semibold cursor-pointer"
          >
            <Download className="mr-1.5 w-3.5 h-3.5" />
            Download ATS PDF
          </Button>
        </div>
      </div>

      {/* Matched & Missing Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Matched Keywords */}
        <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase text-emerald-600 tracking-wider">
              Matched Keywords ({matchedKeywords.length})
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              Found in CV
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 text-xs font-mono font-medium"
              >
                <span>&bull;</span>
                <span>{kw}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Column 2: Missing Keywords & Quick Add */}
        <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase text-amber-600 tracking-wider flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              Missing / Gap Keywords ({missingKeywords.length})
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              Click + to add
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw) => {
              const isAdded = addedSkills.includes(kw);
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => !isAdded && handleAddSkill(kw)}
                  disabled={isAdded}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer border ${
                    isAdded
                      ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                      : "bg-background hover:bg-muted text-foreground border-border"
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
