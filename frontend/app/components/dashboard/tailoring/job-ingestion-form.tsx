import { useState } from "react";
import {
  Sparkles,
  Link2,
  FileText,
  SlidersHorizontal,
  Loader2,
  Globe,
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

    if (parsedUrl.hostname.includes("linkedin")) {
      const match = path.match(/\/jobs\/view\/([^/]+)/);
      if (match && match[1]) {
        const slug = match[1].replace(/-\d+$/, "");
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

    if (parsedUrl.hostname.includes("greenhouse.io")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length > 0) {
        const company = parts[0]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { companyName: company };
      }
    }

    if (parsedUrl.hostname.includes("lever.co")) {
      const parts = path.split("/").filter(Boolean);
      if (parts.length > 0) {
        const company = parts[0]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { companyName: company };
      }
    }

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
  const [jobLocation, setJobLocation] = useState<"remote" | "hybrid" | "onsite">("remote");
  const [portfolioUrl, setPortfolioUrl] = useState<string>("");
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

  const buildContextPrefix = () => {
    const lines: string[] = [];
    const locationLabel = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" }[jobLocation];
    lines.push(`Job Location Type: ${locationLabel}`);
    if (portfolioUrl.trim()) {
      lines.push(`Candidate Portfolio URL: ${portfolioUrl.trim()}`);
    }
    return lines.join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contextPrefix = buildContextPrefix();

    if (activeInputTab === "url") {
      if (!jobUrl.trim()) return;
      const parsed = parseJobUrl(jobUrl);
      const finalRole = roleTitle.trim() || parsed?.roleTitle || "";
      const finalCompany = companyName.trim() || parsed?.companyName || "";
      const positionLabel =
        finalRole || finalCompany
          ? `${finalRole || "Position"} at ${finalCompany || "Company"}`
          : "Target Position";
      const baseText = jdText.trim()
        ? jdText
        : `Job Posting URL: ${jobUrl}\n${positionLabel}.\nPlease extract requirements from this job link and optimize CV bullet points for this position.`;
      const effectiveText = contextPrefix ? `${contextPrefix}\n\n${baseText}` : baseText;
      onAnalyze(effectiveText, finalRole, finalCompany);
      return;
    }

    if (!jdText.trim()) return;
    const effectiveText = contextPrefix ? `${contextPrefix}\n\n${jdText}` : jdText;
    onAnalyze(effectiveText, roleTitle, companyName);
  };

  return (
    <div className="space-y-6 pb-6 border-b border-border">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Target Position & Job Description
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ingest target JD details to perform keyword gap analysis and bullet point optimization.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border shrink-0 self-start sm:self-auto">
          <Sparkles className="w-3 h-3 text-foreground" />
          <span>Truth Grounded Tailoring</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role Title & Company Input Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Target Role Title</Label>
            <Input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="mt-1 text-xs h-9"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Target Company</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="mt-1 text-xs h-9"
            />
          </div>
        </div>

        {/* Location & Portfolio URL Input Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Job Location</Label>
            <div
              className="mt-1 flex rounded-lg border border-border overflow-hidden h-9"
              role="group"
              aria-label="Job location type"
            >
              {([
                { value: "remote", label: "Remote" },
                { value: "hybrid", label: "Hybrid" },
                { value: "onsite", label: "On-site" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setJobLocation(opt.value)}
                  aria-pressed={jobLocation === opt.value}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors cursor-pointer border-r border-border last:border-r-0 ${
                    jobLocation === opt.value
                      ? "bg-foreground text-background"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground" htmlFor="portfolio-url-input">
              <Globe className="inline w-3 h-3 mr-1 -mt-0.5 text-muted-foreground" />
              Portfolio URL (optional)
            </Label>
            <Input
              id="portfolio-url-input"
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://yourportfolio.com"
              className="mt-1 text-xs h-9"
            />
          </div>
        </div>

        {/* Ingestion Method Tabs & Textarea */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant={activeInputTab === "text" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleTabSwitch("text")}
                className="text-xs h-8 cursor-pointer"
              >
                <FileText className="mr-1.5 w-3.5 h-3.5" />
                Raw JD Text
              </Button>
              <Button
                type="button"
                variant={activeInputTab === "url" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleTabSwitch("url")}
                className="text-xs h-8 cursor-pointer"
              >
                <Link2 className="mr-1.5 w-3.5 h-3.5" />
                Job Link URL
              </Button>
            </div>

            {/* Tone Selector */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Tone:</span>
              <select
                value={intensity}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setIntensity(
                    e.target.value as "strict" | "balanced" | "aggressive",
                  )
                }
                className="bg-transparent border border-border rounded-md px-2 py-1 text-xs text-foreground font-medium focus:outline-none"
              >
                <option value="strict">Strict Factual</option>
                <option value="balanced">Balanced ATS</option>
                <option value="aggressive">High-Impact</option>
              </select>
            </div>
          </div>

          {activeInputTab === "text" ? (
            <textarea
              rows={5}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job description text, requirements, responsibilities..."
              className="w-full p-3.5 rounded-xl bg-muted/20 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground leading-relaxed placeholder:text-muted-foreground/60"
            />
          ) : (
            <div className="space-y-2">
              <Input
                value={jobUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://linkedin.com/jobs/view/... or Greenhouse / Lever URL"
                className="text-xs h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Extracts role title and company name from supported job posting links.
              </p>
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground font-mono">
            {activeInputTab === "text"
              ? `${jdText.split(/\s+/).filter(Boolean).length} words`
              : "URL Mode"}
          </span>

          <Button
            type="submit"
            disabled={
              isProcessing ||
              (activeInputTab === "text" ? !jdText.trim() : !jobUrl.trim())
            }
            className="text-xs h-9 px-4 font-medium cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-1.5 w-3.5 h-3.5 animate-spin" />
                Analyzing JD & Running Tailoring Engine...
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
