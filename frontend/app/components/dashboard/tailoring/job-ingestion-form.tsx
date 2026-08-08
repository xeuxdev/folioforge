import { useState } from "react";
import {
  Sparkles,
  Link2,
  FileText,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface JobIngestionFormProps {
  onAnalyze: (jdText: string, roleTitle: string, companyName: string) => void;
  isProcessing: boolean;
}

function parseJobUrl(
  url: string,
): { roleTitle?: string; companyName?: string } | null {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;

    // LinkedIn URLs: /jobs/view/senior-software-engineer-at-acme-3910284
    if (parsedUrl.hostname.includes("linkedin")) {
      const match = path.match(/\/jobs\/view\/([^/]+)/);
      if (match && match[1]) {
        let slug = match[1].replace(/-\d+$/, "");
        if (slug.includes("-at-")) {
          const parts = slug.split("-at-");
          const role = parts[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          const company = parts[1]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          return { roleTitle: role, companyName: company };
        }
        if (!/^\d+$/.test(slug)) {
          const formatted = slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          return { roleTitle: formatted };
        }
      }
    }

    // Greenhouse URLs
    if (parsedUrl.hostname.includes("greenhouse.io")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length > 0) {
        const company = parts[0]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { companyName: company };
      }
    }

    // Lever URLs
    if (parsedUrl.hostname.includes("lever.co")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length > 0) {
        const company = parts[0]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { companyName: company };
      }
    }

    // Generic URL fallback
    const segments = path
      .split("/")
      .filter((s) => s.length > 3 && !/^\d+$/.test(s));
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      if (last.includes("-at-")) {
        const parts = last.split("-at-");
        return {
          roleTitle: parts[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          companyName: parts[1]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        };
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function JobIngestionForm({
  onAnalyze,
  isProcessing,
}: JobIngestionFormProps) {
  const [activeInputTab, setActiveInputTab] = useState<"text" | "url">("text");
  const [roleTitle, setRoleTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [jobUrl, setJobUrl] = useState<string>("");
  const [jdText, setJdText] = useState<string>("");
  const [intensity, setIntensity] = useState<
    "strict" | "balanced" | "aggressive"
  >("balanced");

  const handleUrlChange = (newUrl: string) => {
    setJobUrl(newUrl);
    const parsed = parseJobUrl(newUrl);
    if (parsed?.roleTitle) setRoleTitle(parsed.roleTitle);
    if (parsed?.companyName) setCompanyName(parsed.companyName);
  };

  const handleTabSwitch = (tab: "text" | "url") => {
    setActiveInputTab(tab);
    if (tab === "url" && jobUrl) {
      const parsed = parseJobUrl(jobUrl);
      if (parsed?.roleTitle) setRoleTitle(parsed.roleTitle);
      if (parsed?.companyName) setCompanyName(parsed.companyName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeInputTab === "url") {
      if (!jobUrl.trim()) return;
      const parsed = parseJobUrl(jobUrl);
      const finalRole = roleTitle.trim() || parsed?.roleTitle || "";
      const finalCompany = companyName.trim() || parsed?.companyName || "";
      const positionLabel =
        finalRole || finalCompany
          ? `${finalRole || "Position"} at ${finalCompany || "Company"}`
          : "Target Position";
      const effectiveText = jdText.trim()
        ? jdText
        : `Job Posting URL: ${jobUrl}\n${positionLabel}.\nPlease extract requirements from this job link and optimize CV bullet points for this position.`;
      onAnalyze(effectiveText, finalRole, finalCompany);
      return;
    }

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
            Paste target job description text or URL to initiate factual keyword
            matching and bullet optimization.
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
            <Label className="text-xs text-muted-foreground">
              Target Role Title
            </Label>
            <Input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="mt-1 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              Target Company / Organization
            </Label>
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
                onClick={() => handleTabSwitch("text")}
                className="text-xs font-semibold cursor-pointer"
              >
                <FileText className="mr-1.5 w-3.5 h-3.5" />
                Paste Raw JD Text
              </Button>
              <Button
                type="button"
                variant={activeInputTab === "url" ? "secondary" : "ghost"}
                size="xs"
                onClick={() => handleTabSwitch("url")}
                className="text-xs font-semibold cursor-pointer"
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setIntensity(
                    e.target.value as "strict" | "balanced" | "aggressive",
                  )
                }
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
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://linkedin.com/jobs/view/... or Greenhouse / Lever URL"
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Automatically extracts role title and company name from
                LinkedIn, Greenhouse, and Lever job links.
              </p>
            </div>
          )}
        </div>

        {/* Form Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground font-mono">
            {activeInputTab === "text"
              ? `Input: ${jdText.split(/\s+/).filter(Boolean).length} words`
              : `URL Mode Active`}
          </div>

          <Button
            type="submit"
            disabled={
              isProcessing ||
              (activeInputTab === "text" ? !jdText.trim() : !jobUrl.trim())
            }
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
