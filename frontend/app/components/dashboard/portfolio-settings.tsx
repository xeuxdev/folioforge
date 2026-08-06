import { useState } from "react";
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
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { PortfolioPreviewModal } from "./portfolio-preview-modal";

export function PortfolioSettings() {
  const [selectedTemplate, setSelectedTemplate] = useState<"minimal" | "executive">("minimal");
  const [subdomain, setSubdomain] = useState<string>("alex");
  const [llmTxtEnabled, setLlmTxtEnabled] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Modal preview state
  const [previewTemplate, setPreviewTemplate] = useState<"minimal" | "executive" | null>(null);

  const fullDomain = `${subdomain}.folioforge.com`;

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://${fullDomain}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl w-full mx-auto">
      {/* Live Site & Subdomain Card */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shrink-0 mt-1 sm:mt-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-foreground">
                  Published Portfolio Site
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                  Live & Synced
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl">
                Automatically rendered from your master canonical resume graph. Any updates made in the resume editor instantly reflect here.
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
              href={`/u/${subdomain}`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ size: "sm", className: "text-xs font-semibold" })}
            >
              Visit Site
              <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Subdomain configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Custom Subdomain</Label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center flex-1 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs">
                <span className="text-muted-foreground font-mono">https://</span>
                <input
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="bg-transparent font-semibold text-foreground focus:outline-none px-1.5 font-mono flex-1 min-w-0"
                />
                <span className="text-muted-foreground font-mono">.folioforge.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Sync Strategy</Label>
            <div className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-muted border border-border text-xs text-foreground font-mono">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Realtime CV Graph Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* Template Picker Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Portfolio Themes & Layout Templates
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose your preferred layout. Built with responsive accessibility and clean typography.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border self-start sm:self-auto">
            Active Theme: <strong className="text-foreground capitalize">{selectedTemplate}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template 1: Clean Minimal */}
          <div
            className={`bg-card border-2 p-6 sm:p-8 rounded-2xl space-y-6 transition-all shadow-xs flex flex-col justify-between ${
              selectedTemplate === "minimal"
                ? "border-foreground ring-1 ring-foreground"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <LayoutGrid className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Template 01
                  </span>
                </div>
                {selectedTemplate === "minimal" ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Theme</span>
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setSelectedTemplate("minimal")}
                    className="text-xs cursor-pointer"
                  >
                    Select Theme
                  </Button>
                )}
              </div>

              <h4 className="text-2xl font-bold text-foreground">Clean Minimalist</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Focuses on clean typography, structured career timeline, skill chips, and zero clutter. Optimized for software engineers and product managers.
              </p>

              {/* Template Mini Card Mockup */}
              <div className="bg-muted/50 p-5 rounded-xl border border-border text-xs space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-bold text-foreground">Alex Morgan</span>
                  <span className="text-[10px] font-mono text-muted-foreground">San Francisco, CA</span>
                </div>
                <div className="text-xs text-muted-foreground">Senior Full-Stack Engineer &bull; Xeux Labs</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-mono">React 19</span>
                  <span className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-mono">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-mono">PostgreSQL</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewTemplate("minimal")}
                className="w-full text-xs font-semibold cursor-pointer py-5"
              >
                <Eye className="mr-1.5 w-4 h-4" />
                Live Preview Template 01
              </Button>
            </div>
          </div>

          {/* Template 2: Executive Editorial */}
          <div
            className={`bg-card border-2 p-6 sm:p-8 rounded-2xl space-y-6 transition-all shadow-xs flex flex-col justify-between ${
              selectedTemplate === "executive"
                ? "border-foreground ring-1 ring-foreground"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Template 02
                  </span>
                </div>
                {selectedTemplate === "executive" ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Theme</span>
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setSelectedTemplate("executive")}
                    className="text-xs cursor-pointer"
                  >
                    Select Theme
                  </Button>
                )}
              </div>

              <h4 className="text-2xl font-bold text-foreground">Executive Editorial</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Narrative bio layout with prominent project showcase cards, metric highlights, and high-impact header hierarchy.
              </p>

              {/* Template Mini Card Mockup */}
              <div className="bg-muted/50 p-5 rounded-xl border border-border text-xs space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-extrabold text-foreground text-sm">Engineering Leader</span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">2M+ Sessions</span>
                </div>
                <div className="text-xs text-muted-foreground">Featured Project: Node.js Scalable Microservices</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-mono">Drizzle ORM</span>
                  <span className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-mono">BullMQ</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewTemplate("executive")}
                className="w-full text-xs font-semibold cursor-pointer py-5"
              >
                <Eye className="mr-1.5 w-4 h-4" />
                Live Preview Template 02
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* llm.txt Machine-Readable Profile Section */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <FileCode2 className="w-6 h-6 text-foreground shrink-0" />
            <div>
              <h4 className="text-base sm:text-lg font-bold text-foreground">
                AI-Readable Profile Export (<code className="font-mono text-xs">/llm.txt</code>)
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Exposes a structured markdown summary so AI recruiting agents and LLM crawlers can accurately read your background.
              </p>
            </div>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={llmTxtEnabled}
              onChange={(e) => setLlmTxtEnabled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-ring"
            />
            <span className="text-xs font-semibold text-foreground">Enable /llm.txt</span>
          </label>
        </div>

        {llmTxtEnabled && (
          <div className="bg-muted/40 p-4 rounded-xl border border-border font-mono text-xs text-foreground space-y-2 overflow-x-auto">
            <div className="text-muted-foreground text-[11px] font-semibold border-b border-border pb-1">
              Preview of https://{fullDomain}/llm.txt
            </div>
            <pre className="text-xs text-foreground leading-relaxed">
{`# Alex Morgan - Senior Full-Stack Engineer

> Contact: alex.morgan@xeux.labs | San Francisco, CA | https://alexmorgan.dev

## Core Summary
Full-Stack Engineer specializing in high-throughput Node.js microservices, PostgreSQL query optimization, and type-safe React applications.

## Technical Skills
- Languages: TypeScript, JavaScript, SQL, HTML/CSS
- Frameworks: React 19, React Router v8, Express.js, Tailwind CSS v4
- Infrastructure: PostgreSQL, Drizzle ORM, Redis, BullMQ, Docker`}
            </pre>
          </div>
        )}
      </div>

      {/* Interactive Full-Screen Live Preview Modal */}
      {previewTemplate && (
        <PortfolioPreviewModal
          isOpen={!!previewTemplate}
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelectTemplate={(tpl) => setSelectedTemplate(tpl)}
        />
      )}
    </div>
  );
}
