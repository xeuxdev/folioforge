import { useState } from "react";
import { Sparkles, Link2, FileText, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface JobIngestionFormProps {
  onAnalyze: (jdText: string, roleTitle: string, companyName: string) => void;
  isProcessing: boolean;
}

export function JobIngestionForm({ onAnalyze, isProcessing }: JobIngestionFormProps) {
  const [activeInputTab, setActiveInputTab] = useState<"text" | "url">("text");
  const [roleTitle, setRoleTitle] = useState<string>("Senior Full-Stack Engineer");
  const [companyName, setCompanyName] = useState<string>("Xeux Labs");
  const [jobUrl, setJobUrl] = useState<string>("https://linkedin.com/jobs/view/3910284");
  const [jdText, setJdText] = useState<string>(
    "We are looking for a Senior Full-Stack Engineer to architect high-throughput Node.js microservices, design optimized PostgreSQL queries using Drizzle ORM, and build responsive React applications with Tailwind CSS v4 and BullMQ worker queues. You will lead technical design for real-time document workflows and ensure 99.99% system availability."
  );
  const [intensity, setIntensity] = useState<"strict" | "balanced" | "aggressive">("balanced");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;
    onAnalyze(jdText, roleTitle, companyName);
  };

  return (
    <div className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-foreground">
              Job Description Ingestion & Constrained LLM Tailoring
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Paste target job description text or URL to initiate factual keyword matching and bullet optimization.
          </p>
        </div>

        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-muted text-muted-foreground border border-border shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-foreground" />
          <span>Factual Truthfulness Guarantee</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role & Company Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Target Role Title</Label>
            <Input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="mt-1 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Target Company / Organization</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Xeux Labs"
              className="mt-1 text-xs"
            />
          </div>
        </div>

        {/* Input Method Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={activeInputTab === "text" ? "secondary" : "ghost"}
                size="xs"
                onClick={() => setActiveInputTab("text")}
                className="text-xs font-semibold"
              >
                <FileText className="mr-1.5 w-3.5 h-3.5" />
                Paste Raw JD Text
              </Button>
              <Button
                type="button"
                variant={activeInputTab === "url" ? "secondary" : "ghost"}
                size="xs"
                onClick={() => setActiveInputTab("url")}
                className="text-xs font-semibold"
              >
                <Link2 className="mr-1.5 w-3.5 h-3.5" />
                Fetch Job URL
              </Button>
            </div>

            {/* Tailoring Intensity Preset */}
            <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Tailoring Tone:</span>
              <select
                value={intensity}
                onChange={(e: any) => setIntensity(e.target.value)}
                className="bg-muted border border-border rounded-lg px-2 py-1 text-xs text-foreground font-mono focus:outline-none"
              >
                <option value="strict">Strict Factual Alignment</option>
                <option value="balanced">Balanced ATS Keyword Focus</option>
                <option value="aggressive">High-Impact Leadership Tone</option>
              </select>
            </div>
          </div>

          {activeInputTab === "text" ? (
            <textarea
              rows={5}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste target job description requirements, responsibilities, and qualifications..."
              className="w-full p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
            />
          ) : (
            <div className="space-y-2">
              <Input
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://linkedin.com/jobs/view/... or Greenhouse / Lever URL"
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Fetches and parses job posting content automatically from LinkedIn, Greenhouse, Lever, and Workday.
              </p>
            </div>
          )}
        </div>

        {/* Form Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground font-mono">
            Input: {jdText.split(/\s+/).filter(Boolean).length} words
          </div>

          <Button
            type="submit"
            disabled={isProcessing || !jdText.trim()}
            className="text-xs font-semibold cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-1.5 w-3.5 h-3.5 animate-spin" />
                Running LLM Keyword Matcher...
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 w-3.5 h-3.5" />
                Analyze JD & Run Tailoring Engine
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
