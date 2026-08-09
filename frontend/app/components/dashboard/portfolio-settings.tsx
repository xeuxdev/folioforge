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
  Server,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { PortfolioPreviewModal } from "./portfolio-preview-modal";
import { usePortfolioPreferences } from "~/hooks/use-portfolio";
import { useAuth } from "~/hooks/use-auth";
import { useResumes } from "~/hooks/use-resumes";
import { canonicalToPortfolioData } from "~/lib/portfolio-adapter";

import type { PortfolioTemplateType } from "~/types/portfolio";

export function PortfolioSettings() {
  const {
    preferences,
    isLoading,
    updatePreferences,
    isUpdating,
    setCustomDomain,
    isSettingDomain,
    verifyCustomDomain,
    isVerifyingDomain,
    removeCustomDomain,
    isRemovingDomain,
  } = usePortfolioPreferences();

  const { user } = useAuth();
  const { resumes } = useResumes();

  const [selectedTemplate, setSelectedTemplate] =
    useState<PortfolioTemplateType>("minimal");
  const [subdomain, setSubdomain] = useState<string>("");
  const [customDomainInput, setCustomDomainInput] = useState<string>("");
  const [llmTxtEnabled, setLlmTxtEnabled] = useState<boolean>(true);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedTxtToken, setCopiedTxtToken] = useState<boolean>(false);
  const [copiedCnameValue, setCopiedCnameValue] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [domainMessage, setDomainMessage] = useState<string | null>(null);

  // Modal preview state
  const [previewTemplate, setPreviewTemplate] =
    useState<PortfolioTemplateType | null>(null);

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
      setCustomDomainInput(preferences.customDomain ?? "");
    }
  }, [preferences, user?.name]);

  // Dirty state calculation
  const initialTemplate = preferences?.selectedTemplate ?? "minimal";
  const initialSubdomain =
    preferences?.subdomain ??
    user?.name?.toLowerCase().replace(/\s+/g, "-") ??
    "";
  const initialLlmTxt = preferences?.llmTxtEnabled ?? true;
  const initialSelectedResumeId = preferences?.selectedResumeId ?? null;

  const isPortfolioDirty =
    selectedTemplate !== initialTemplate ||
    subdomain !== initialSubdomain ||
    llmTxtEnabled !== initialLlmTxt ||
    selectedResumeId !== initialSelectedResumeId;

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
    : canonicalToPortfolioData(null);

  const fullDomain = subdomain
    ? `${subdomain}.folioforge.com`
    : "your-subdomain.folioforge.com";

  const activeCustomDomain = preferences?.customDomain ?? null;
  const domainStatus = preferences?.domainVerificationStatus ?? "unverified";
  const verificationToken = preferences?.domainVerificationToken ?? null;

  const visitUrl = activeCustomDomain
    ? `https://${activeCustomDomain}`
    : subdomain
      ? `/u/${subdomain}`
      : "#";

  const copyUrl = () => {
    const targetUrl = activeCustomDomain
      ? `https://${activeCustomDomain}`
      : `https://${fullDomain}`;
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSavePreferences = async () => {
    if (!isPortfolioDirty) return;
    await updatePreferences({
      selectedTemplate,
      subdomain,
      llmTxtEnabled,
      selectedResumeId,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSetCustomDomain = async () => {
    if (!customDomainInput.trim()) return;
    setDomainMessage(null);
    try {
      await setCustomDomain({ customDomain: customDomainInput.trim() });
      setDomainMessage(
        "Custom domain saved. Please configure DNS records below and verify.",
      );
    } catch (err: unknown) {
      const errStr =
        err instanceof Error ? err.message : "Failed to set custom domain";
      setDomainMessage(`Error: ${errStr}`);
    }
  };

  const handleVerifyCustomDomain = async () => {
    setDomainMessage(null);
    try {
      const res = await verifyCustomDomain();
      setDomainMessage(res.message);
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : "Verification failed";
      setDomainMessage(`Verification error: ${errStr}`);
    }
  };

  const handleRemoveCustomDomain = async () => {
    setDomainMessage(null);
    try {
      await removeCustomDomain();
      setCustomDomainInput("");
      setDomainMessage("Custom domain binding removed.");
    } catch (err: unknown) {
      const errStr =
        err instanceof Error ? err.message : "Failed to remove domain";
      setDomainMessage(`Error: ${errStr}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full mx-auto pb-20 text-foreground">
      {/* ── Top Overview & Published Status Bar ── */}
      <div className="pb-6 border-b border-border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Published Portfolio Site
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                  aria-hidden="true"
                />
                Live &amp; Synced
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Automatically builds and updates from your master resume graph
              data.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={copyUrl}
              className="text-xs h-8 font-medium cursor-pointer"
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
              className={buttonVariants({
                size: "sm",
                className: "text-xs h-8 font-medium",
              })}
            >
              Visit Published Site
              <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live URL Display Strip */}
        <div className="py-2.5 px-4 rounded-xl bg-muted/20 border border-border flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">URL:</span>
            <span className="font-semibold text-foreground truncate">
              {activeCustomDomain
                ? `https://${activeCustomDomain}`
                : `https://${fullDomain}`}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground capitalize font-sans font-medium shrink-0">
            Active Theme: {selectedTemplate}
          </span>
        </div>
      </div>

      {/* ── Step 1: Content Source ── */}
      <div className="py-6 border-b border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              01
            </span>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Select Resume Data Source
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pick the parsed master resume that powers your portfolio
                information.
              </p>
            </div>
          </div>

          {selectedResumeId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedResumeId(null)}
              className="text-xs h-8 cursor-pointer shrink-0 text-muted-foreground"
            >
              <PinOff className="mr-1 w-3.5 h-3.5" />
              Use Latest Resume
            </Button>
          )}
        </div>

        {parsedResumes.length === 0 ? (
          <p className="text-xs text-muted-foreground py-3 italic">
            No parsed resumes found. Upload a resume to populate your portfolio
            content.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
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
                    className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isActive
                        ? "border-foreground bg-muted/30"
                        : "border-border hover:border-foreground/40 bg-card"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-foreground text-background">
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
                          {resume.fileType.toUpperCase()} •{" "}
                          {(resume.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* ── Step 2: Theme Selection ── */}
      <div className="py-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              02
            </span>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Select Portfolio Theme
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose the visual design layout for your public portfolio
                website.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-muted-foreground">
            Selected:{" "}
            <strong className="text-foreground capitalize">
              {selectedTemplate}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
          {/* Theme 01: Minimalist */}
          <div
            onClick={() => setSelectedTemplate("minimal")}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 flex flex-col justify-between ${
              selectedTemplate === "minimal"
                ? "border-foreground bg-muted/20"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Theme 01
                  </span>
                </div>
                {selectedTemplate === "minimal" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-foreground text-background">
                    <Check className="w-3 h-3" />
                    <span>Active Theme</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">
                    Select
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">
                  Clean Minimalist
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Clean typographic hierarchy, timeline work experiences, and
                  structured skills list.
                </p>
              </div>

              {/* Data Preview */}
              <div className="p-3 rounded-lg border border-border bg-background text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span className="font-semibold text-foreground">
                    {portfolioData.fullName}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {portfolioData.location || "Location"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {portfolioData.roleTitle || "Software Engineer"}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewTemplate("minimal");
              }}
              className="w-full text-xs h-8 font-medium cursor-pointer"
            >
              <Eye className="mr-1.5 w-3.5 h-3.5" />
              Preview Minimalist Theme
            </Button>
          </div>

          {/* Theme 02: Executive */}
          <div
            onClick={() => setSelectedTemplate("executive")}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 flex flex-col justify-between ${
              selectedTemplate === "executive"
                ? "border-foreground bg-muted/20"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Theme 02
                  </span>
                </div>
                {selectedTemplate === "executive" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-foreground text-background">
                    <Check className="w-3 h-3" />
                    <span>Active Theme</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">
                    Select
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground">
                  Executive Editorial
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Editorial header layout, prominent project highlights, and
                  detailed career milestones.
                </p>
              </div>

              {/* Data Preview */}
              <div className="p-3 rounded-lg border border-border bg-background text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span className="font-semibold text-foreground">
                    {portfolioData.roleTitle || "Role Title"}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-medium">
                    Editorial
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {portfolioData.projects[0]?.title || portfolioData.fullName}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewTemplate("executive");
              }}
              className="w-full text-xs h-8 font-medium cursor-pointer"
            >
              <Eye className="mr-1.5 w-3.5 h-3.5" />
              Preview Executive Theme
            </Button>
          </div>
        </div>
      </div>

      {/* ── Step 3: Subdomain & Machine-Readable /llm.txt ── */}
      <div className="py-6 border-b border-border space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-semibold text-muted-foreground">
            03
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Subdomain &amp; AI Machine Endpoint
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set your FolioForge subdomain handle and enable machine-readable
              AI agent exports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Subdomain Handle
            </Label>
            <div className="flex items-center rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs font-mono">
              <span className="text-muted-foreground">https://</span>
              <input
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                placeholder="your-handle"
                aria-label="Subdomain handle"
                className="bg-transparent font-semibold text-foreground focus:outline-none px-1 font-mono flex-1 min-w-0"
              />
              <span className="text-muted-foreground">.folioforge.com</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Sync Mode</Label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border text-xs text-foreground font-mono">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Realtime CV Graph Sync</span>
            </div>
          </div>
        </div>

        {/* /llm.txt Endpoint */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-foreground shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">
                  AI Agent Endpoint (
                  <code className="font-mono text-muted-foreground">
                    /llm.txt
                  </code>
                  )
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Exposes plain-text markdown at{" "}
                  <code className="font-mono">
                    https://{fullDomain}/llm.txt
                  </code>{" "}
                  for LLM agents.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <input
                type="checkbox"
                id="llm-txt-toggle"
                checked={llmTxtEnabled}
                onChange={(e) => setLlmTxtEnabled(e.target.checked)}
                className="rounded border-border text-foreground focus:ring-ring"
              />
              <span className="text-xs font-medium text-foreground">
                Enable
              </span>
            </label>
          </div>

          {llmTxtEnabled && (
            <div className="p-3.5 rounded-lg border border-border bg-muted/20 font-mono text-xs text-foreground space-y-1.5 overflow-x-auto max-h-36">
              <div className="text-[10px] text-muted-foreground font-semibold border-b border-border/60 pb-1">
                Preview of https://{fullDomain}/llm.txt
              </div>
              <pre className="text-[11px] text-foreground leading-relaxed whitespace-pre-wrap">
                {`# ${portfolioData.fullName}
> Email: ${portfolioData.email}
> Location: ${portfolioData.location}

## Summary
${portfolioData.bio}`}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* ── Step 4: Bring Your Own Custom Domain ── */}
      <div className="py-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-semibold text-muted-foreground">
              04
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  Custom Domain Binding
                </h3>
                {domainStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified &amp; Active
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect your personal custom domain (e.g.,{" "}
                <code className="font-mono">yourdomain.com</code>).
              </p>
            </div>
          </div>

          {activeCustomDomain && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveCustomDomain}
              disabled={isRemovingDomain}
              className="text-xs h-8 font-medium text-destructive hover:text-destructive cursor-pointer shrink-0"
            >
              {isRemovingDomain ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 mr-1" />
              )}
              Remove Custom Domain
            </Button>
          )}
        </div>

        {/* Custom Domain Input Bar */}
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs flex items-center">
              <Server className="w-3.5 h-3.5 text-muted-foreground mr-2 shrink-0" />
              <input
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                placeholder="e.g. yourdomain.com or cv.yourdomain.com"
                aria-label="Custom domain input"
                className="bg-transparent font-mono font-semibold text-foreground focus:outline-none flex-1 min-w-0"
              />
            </div>

            <Button
              size="sm"
              onClick={handleSetCustomDomain}
              disabled={
                isSettingDomain ||
                !customDomainInput.trim() ||
                customDomainInput.trim() === (activeCustomDomain || "")
              }
              className="text-xs h-8 font-medium cursor-pointer shrink-0"
            >
              {isSettingDomain ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Custom Domain
                </>
              )}
            </Button>

            {activeCustomDomain && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleVerifyCustomDomain}
                disabled={isVerifyingDomain}
                className="text-xs h-8 font-medium cursor-pointer shrink-0"
              >
                {isVerifyingDomain ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5 text-emerald-600" />
                    Checking DNS...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Verify DNS
                  </>
                )}
              </Button>
            )}
          </div>

          {domainMessage && (
            <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs font-mono text-foreground flex items-center justify-between">
              <span>{domainMessage}</span>
            </div>
          )}
        </div>

        {/* DNS Record Boxes */}
        {activeCustomDomain && (
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground font-mono">
              DNS Configuration Instructions for {activeCustomDomain}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-muted/20 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span className="font-semibold text-foreground font-mono">
                    Option A: CNAME Record
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      navigator.clipboard.writeText("cname.folioforge.com");
                      setCopiedCnameValue(true);
                      setTimeout(() => setCopiedCnameValue(false), 2000);
                    }}
                    className="text-[10px] font-mono cursor-pointer"
                  >
                    {copiedCnameValue ? (
                      <Check className="w-3 h-3 text-emerald-600 mr-1" />
                    ) : (
                      <Copy className="w-3 h-3 mr-1" />
                    )}
                    Copy Value
                  </Button>
                </div>
                <div className="font-mono text-[11px] space-y-1 text-muted-foreground">
                  <div>
                    Type: <strong className="text-foreground">CNAME</strong>
                  </div>
                  <div>
                    Target:{" "}
                    <strong className="text-foreground">
                      cname.folioforge.com
                    </strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-muted/20 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span className="font-semibold text-foreground font-mono">
                    Option B: TXT Verification
                  </span>
                  {verificationToken && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        navigator.clipboard.writeText(verificationToken);
                        setCopiedTxtToken(true);
                        setTimeout(() => setCopiedTxtToken(false), 2000);
                      }}
                      className="text-[10px] font-mono cursor-pointer"
                    >
                      {copiedTxtToken ? (
                        <Check className="w-3 h-3 text-emerald-600 mr-1" />
                      ) : (
                        <Copy className="w-3 h-3 mr-1" />
                      )}
                      Copy Token
                    </Button>
                  )}
                </div>
                <div className="font-mono text-[11px] space-y-1 text-muted-foreground truncate">
                  <div>
                    Type: <strong className="text-foreground">TXT</strong>
                  </div>
                  <div className="truncate">
                    Value:{" "}
                    <strong className="text-foreground font-semibold truncate">
                      {verificationToken || "Generating..."}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Bottom Action Bar ── */}
      <div className="sticky bottom-4 z-20 bg-card/95 backdrop-blur-md border border-border p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs">
          <Sliders className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground capitalize">
              Theme: {selectedTemplate}
            </span>
            <span className="mx-2">•</span>
            <span>
              Domain:{" "}
              <code className="font-mono text-foreground font-semibold">
                {activeCustomDomain || subdomain || "default"}
              </code>
            </span>
          </div>
        </div>

        <Button
          size="default"
          onClick={handleSavePreferences}
          disabled={isUpdating || !isPortfolioDirty}
          className="w-full sm:w-auto text-xs font-semibold cursor-pointer px-6 h-9"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" />
              Publishing Changes...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="mr-2 w-3.5 h-3.5 text-emerald-400" />
              Published &amp; Saved
            </>
          ) : (
            <>
              <Save className="mr-2 w-3.5 h-3.5" />
              Publish &amp; Save Portfolio
            </>
          )}
        </Button>
      </div>

      {/* Full-Screen Live Preview Modal */}
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
