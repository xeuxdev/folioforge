import { useState, useEffect } from "react";
import {
  Globe,
  ExternalLink,
  RefreshCw,
  FileCode2,
  Copy,
  CheckCircle2,
  Eye,
  Check,
  LayoutGrid,
  Sparkles,
  Save,
  Loader2,
  FileText,
  Pin,
  PinOff,
  Sliders,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { PortfolioPreviewModal } from "./portfolio-preview-modal";
import { usePortfolioPreferences } from "~/hooks/use-portfolio";
import { useAuth } from "~/hooks/use-auth";
import { useResumes } from "~/hooks/use-resumes";
import { canonicalToPortfolioData } from "~/lib/portfolio-adapter";
import { defaultPortfolioData } from "~/components/portfolio/minimal-template";

export function PortfolioSettings() {
  const { preferences, isLoading, updatePreferences, isUpdating } =
    usePortfolioPreferences();
  const { user } = useAuth();
  const { resumes } = useResumes();

  const [selectedTemplate, setSelectedTemplate] = useState<
    "minimal" | "executive"
  >("minimal");
  const [subdomain, setSubdomain] = useState<string>("");
  const [llmTxtEnabled, setLlmTxtEnabled] = useState<boolean>(true);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Modal preview state
  const [previewTemplate, setPreviewTemplate] = useState<
    "minimal" | "executive" | null
  >(null);

  // Sync local state once preferences load from the API
  useEffect(() => {
    if (preferences) {
      setSelectedTemplate(preferences.selectedTemplate);
      setSubdomain(
        preferences.subdomain ??
          user?.name?.toLowerCase().replace(/\s+/g, "-") ??
          "",
      );
      setLlmTxtEnabled(preferences.llmTxtEnabled);
      setSelectedResumeId(preferences.selectedResumeId ?? null);
    }
  }, [preferences, user?.name]);

  // Parsed resumes available for portfolio source selection
  const parsedResumes = resumes.filter(
    (r) => r.parsingStatus === "completed" && r.parsedData,
  );

  // Resolve active resume: pinned first, fallback to latest
  const activeResume =
    (selectedResumeId
      ? parsedResumes.find((r) => r.id === selectedResumeId)
      : null) ??
    parsedResumes.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];

  const portfolioData = activeResume?.parsedData
    ? canonicalToPortfolioData(activeResume.parsedData)
    : defaultPortfolioData;

  const fullDomain = subdomain
    ? `${subdomain}.folioforge.com`
    : "your-subdomain.folioforge.com";

  // Build visit URL - passing selected template as query param preview if desired
  const visitUrl = subdomain ? `/u/${subdomain}` : "#";

  const copyUrl = () => {
    const fullUrl = `https://${fullDomain}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSave = async () => {
    await updatePreferences({
      selectedTemplate,
      subdomain,
      llmTxtEnabled,
      selectedResumeId,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl w-full mx-auto pb-16">
      {/* ── Top Header & Live URL Card ── */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-foreground">
                  Published Portfolio Site
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                  Live &amp; Synced
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl">
                Your portfolio is live at your custom domain and updates instantly when saved.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={copyUrl}
              className="text-xs font-semibold cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="mr-1.5 w-3.5 h-3.5 text-emerald-600" />
                  URL Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 w-3.5 h-3.5" />
                  Copy Link
                </>
              )}
            </Button>
            <a
              href={visitUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ size: "sm", className: "text-xs font-semibold" })}
            >
              Visit Published Site
              <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live URL Display Bar */}
        <div className="bg-muted/40 border border-border p-3.5 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-muted-foreground">URL:</span>
            <span className="font-bold text-foreground truncate">https://{fullDomain}</span>
          </div>
          <span className="text-[11px] text-muted-foreground bg-card border border-border px-2.5 py-1 rounded-md capitalize font-sans font-semibold shrink-0">
            Theme: {selectedTemplate}
          </span>
        </div>
      </div>

      {/* ── Step 1: Content Source ── */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs font-mono">
              01
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Select Resume Source
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pick the parsed resume data that feeds your live portfolio content.
              </p>
            </div>
          </div>

          {selectedResumeId && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setSelectedResumeId(null)}
              className="text-xs cursor-pointer shrink-0 text-muted-foreground"
            >
              <PinOff className="mr-1 w-3.5 h-3.5" />
              Use Auto-Latest
            </Button>
          )}
        </div>

        {parsedResumes.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No parsed resumes found. Upload a resume to populate your portfolio content.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {parsedResumes
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              )
              .map((resume, idx) => {
                const isActive =
                  selectedResumeId === resume.id ||
                  (!selectedResumeId && idx === 0);
                const isPinned = selectedResumeId === resume.id;

                return (
                  <button
                    key={resume.id}
                    type="button"
                    onClick={() =>
                      setSelectedResumeId(isPinned ? null : resume.id)
                    }
                    className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                      isActive
                        ? "border-foreground ring-1 ring-foreground bg-muted/30"
                        : "border-border hover:border-foreground/40 bg-card"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                        {isPinned ? (
                          <Pin className="w-2.5 h-2.5" />
                        ) : (
                          <Check className="w-2.5 h-2.5" />
                        )}
                        {isPinned ? "Pinned" : "Active"}
                      </span>
                    )}

                    <div className="flex items-start gap-2.5 pr-14">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {resume.title}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          {resume.fileType.toUpperCase()} &middot;{" "}
                          {(resume.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground font-mono">
                      Updated{" "}
                      {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* ── Step 2: Theme & Layout Selection ── */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs font-mono">
              02
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Select Portfolio Theme
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose the design layout to publish for your public site.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border self-start sm:self-auto">
            Selected Theme:{" "}
            <strong className="text-foreground capitalize">{selectedTemplate}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template 01: Clean Minimalist */}
          <div
            onClick={() => setSelectedTemplate("minimal")}
            className={`group relative bg-card border-2 p-6 rounded-2xl space-y-5 transition-all cursor-pointer flex flex-col justify-between ${
              selectedTemplate === "minimal"
                ? "border-foreground ring-1 ring-foreground bg-muted/20"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <LayoutGrid className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Theme 01
                  </span>
                </div>
                {selectedTemplate === "minimal" ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    <Check className="w-3.5 h-3.5" />
                    <span>Selected for Publishing</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium">
                    Click to Select
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xl font-bold text-foreground">Clean Minimalist</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Typography-focused layout with clear timeline, clean skill tags, and uncluttered presentation.
                </p>
              </div>

              {/* Layout Thumbnail Mockup */}
              <div className="bg-muted/50 p-4 rounded-xl border border-border text-xs space-y-2.5 font-sans">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-bold text-foreground">{portfolioData.fullName}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{portfolioData.location}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{portfolioData.roleTitle}</div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {portfolioData.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate("minimal");
                }}
                className="w-full text-xs font-semibold cursor-pointer"
              >
                <Eye className="mr-1.5 w-3.5 h-3.5" />
                Preview Theme 01
              </Button>
            </div>
          </div>

          {/* Template 02: Executive Editorial */}
          <div
            onClick={() => setSelectedTemplate("executive")}
            className={`group relative bg-card border-2 p-6 rounded-2xl space-y-5 transition-all cursor-pointer flex flex-col justify-between ${
              selectedTemplate === "executive"
                ? "border-foreground ring-1 ring-foreground bg-muted/20"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Theme 02
                  </span>
                </div>
                {selectedTemplate === "executive" ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    <Check className="w-3.5 h-3.5" />
                    <span>Selected for Publishing</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium">
                    Click to Select
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xl font-bold text-foreground">Executive Editorial</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  High-impact editorial hero, prominent project showcase cards, and metric highlights.
                </p>
              </div>

              {/* Layout Thumbnail Mockup */}
              <div className="bg-muted/50 p-4 rounded-xl border border-border text-xs space-y-2.5 font-sans">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-extrabold text-foreground text-sm">{portfolioData.roleTitle}</span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Featured</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {portfolioData.projects[0]?.title ?? portfolioData.bio.slice(0, 45)}
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {portfolioData.skills.slice(0, 2).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate("executive");
                }}
                className="w-full text-xs font-semibold cursor-pointer"
              >
                <Eye className="mr-1.5 w-3.5 h-3.5" />
                Preview Theme 02
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Step 3: Custom Subdomain & AI Profile Settings ── */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs font-mono">
              03
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Domain &amp; Machine-Readable Export
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure your custom subdomain handle and AI /llm.txt endpoint.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Custom Subdomain</Label>
            <div className="flex items-center rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs">
              <span className="text-muted-foreground font-mono">https://</span>
              <input
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                placeholder="your-handle"
                aria-label="Subdomain handle"
                className="bg-transparent font-semibold text-foreground focus:outline-none px-1.5 font-mono flex-1 min-w-0"
              />
              <span className="text-muted-foreground font-mono">.folioforge.com</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Sync Mode</Label>
            <div className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-muted border border-border text-xs text-foreground font-mono">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Realtime CV Graph Sync</span>
            </div>
          </div>
        </div>

        {/* /llm.txt Section */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode2 className="w-4 h-4 text-foreground shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  AI Profile Export (<code className="font-mono">/llm.txt</code>)
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Generates plain-text markdown at <code className="font-mono">https://{fullDomain}/llm.txt</code> for LLM agents.
                </p>
              </div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer shrink-0">
              <input
                type="checkbox"
                id="llm-txt-toggle"
                checked={llmTxtEnabled}
                onChange={(e) => setLlmTxtEnabled(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring"
              />
              <span className="text-xs font-semibold text-foreground">Enable</span>
            </label>
          </div>

          {llmTxtEnabled && (
            <div className="bg-muted/40 p-4 rounded-xl border border-border font-mono text-xs text-foreground space-y-1.5 overflow-x-auto max-h-40">
              <div className="text-muted-foreground text-[10px] font-semibold border-b border-border pb-1">
                Preview of https://{fullDomain}/llm.txt
              </div>
              <pre className="text-[11px] text-foreground leading-relaxed whitespace-pre-wrap">
                {`# ${portfolioData.fullName}
> Email: ${portfolioData.email}
> Location: ${portfolioData.location}

## Professional Summary
${portfolioData.bio}`}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Sticky Publish & Save Action Bar ── */}
      <div className="bg-card border border-border p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
        <div className="flex items-center space-x-3 text-xs">
          <Sliders className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <div className="text-muted-foreground">
            <span className="font-semibold text-foreground capitalize">Theme: {selectedTemplate}</span>
            <span className="mx-2">&middot;</span>
            <span>Subdomain: <code className="font-mono text-foreground font-semibold">{subdomain || "default"}</code></span>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <Button
            size="default"
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full sm:w-auto text-xs font-semibold cursor-pointer px-6 py-2.5"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Publishing Changes...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="mr-2 w-4 h-4 text-emerald-400" />
                Published &amp; Saved
              </>
            ) : (
              <>
                <Save className="mr-2 w-4 h-4" />
                Publish &amp; Save Portfolio
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Interactive Full-Screen Live Preview Modal */}
      {previewTemplate && (
        <PortfolioPreviewModal
          isOpen={!!previewTemplate}
          template={previewTemplate}
          data={portfolioData}
          onClose={() => setPreviewTemplate(null)}
          onSelectTemplate={(tpl) => {
            setSelectedTemplate(tpl);
            setPreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
}
