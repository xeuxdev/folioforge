import { useState } from "react";
import {
  FileCode,
  Sparkles,
  Download,
  ExternalLink,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  Globe,
  FileText,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function SolutionSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const steps = [
    {
      number: "Step 01",
      title: "Store Your Master Resume Graph",
      description:
        "Define your career history once. Roles, achievements, metrics, education, and technical skills are structured in a clean JSON schema with strict Zod types.",
      icon: FileCode,
    },
    {
      number: "Step 02",
      title: "AI Job Description Alignment",
      description:
        "Paste a target job posting. BullMQ worker queues invoke LLMs to extract key keywords and suggest bullet point refinements in an explicit diff viewer.",
      icon: Sparkles,
    },
    {
      number: "Step 03",
      title: "Dual Output: Vector PDF + Hosted Site",
      description:
        "Export crisp vector PDFs and DOCX files for ATS job portals, while hosting a responsive, SSL-secured web portfolio at your custom subdomain.",
      icon: Download,
    },
  ];

  return (
    <section
      id="solution"
      className="py-20 md:py-28 bg-muted/40 border-y border-border px-4 sm:px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
            Act III: The Solution
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-foreground font-bold mt-4 tracking-tight">
            How FolioForge delivers speed, safety, and performance.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Three streamlined steps transform fragmented notes into ATS-tailored applications and live portfolio websites.
          </p>
        </div>

        {/* Step Selector & Detailed Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Step Buttons */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeTab === idx;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-card border-primary ring-1 ring-primary"
                      : "bg-card/60 border-border hover:bg-card hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                      {step.number}
                    </span>
                    <Icon
                      className={`w-5 h-5 ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Rich Detailed Showcase Container */}
          <div className="lg:col-span-7 bg-card text-card-foreground rounded-2xl p-6 border border-border flex flex-col justify-between space-y-6">
            {/* Top Toolbar Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                <span className="ml-2 text-xs font-mono font-semibold text-foreground">
                  {activeTab === 0 && "Canonical Zod Resume Graph Engine"}
                  {activeTab === 1 && "BullMQ AI Keyword Alignment Engine"}
                  {activeTab === 2 && "Vector PDF & Subdomain Portfolio Engine"}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Validated Engine</span>
              </span>
            </div>

            {/* TAB 01 SHOWCASE: Master Resume Graph */}
            {activeTab === 0 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Schema Definition (TypeScript + Zod)</span>
                    <span className="text-emerald-700 font-semibold">Strict Type Safety</span>
                  </div>
                  <pre className="font-mono text-xs text-foreground p-4 bg-muted rounded-xl overflow-x-auto border border-border leading-relaxed">
                    <code>{`export const CanonicalResumeGraphSchema = z.object({
  meta: z.object({ version: z.string(), updatedAt: z.string() }),
  contact: z.object({ name: z.string(), email: z.string().email(), location: z.string() }),
  workExperience: z.array(z.object({
    id: z.string(),
    company: z.string(),
    role: z.string(),
    period: z.string(),
    bullets: z.array(z.string()),
    skillsUsed: z.array(z.string()),
  })),
  projects: z.array(ProjectSchema),
  skills: z.array(z.string()),
});`}</code>
                  </pre>
                </div>

                {/* Graph Metadata Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
                  <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Database Storage</div>
                    <div className="font-semibold text-foreground flex items-center space-x-1">
                      <Database className="w-3.5 h-3.5 text-foreground" />
                      <span>PostgreSQL JSONB</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Validation</div>
                    <div className="font-semibold text-foreground flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zod v3 Runtime</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-1 col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Revision Control</div>
                    <div className="font-semibold text-foreground flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-foreground" />
                      <span>Immutable History</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 02 SHOWCASE: AI Alignment */}
            {activeTab === 1 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Job Posting Matcher & Diff Pipeline</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      98% ATS Match
                    </span>
                  </div>

                  {/* Visual Diff Box */}
                  <div className="p-4 bg-muted rounded-xl border border-border space-y-2 text-xs font-mono">
                    <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                      Tailoring Job Description: Senior Distributed Systems Engineer
                    </div>
                    <div className="p-2.5 bg-background rounded-lg border border-border text-muted-foreground leading-relaxed">
                      <span className="text-red-600 font-bold">- </span>
                      "Maintained backend servers and wrote database queries for application endpoints."
                    </div>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 leading-relaxed font-semibold">
                      <span className="text-emerald-700 font-bold">+ </span>
                      "Architected Node.js & Redis microservices serving 2.4M+ daily active sessions with 99.99% uptime and &lt;45ms p99 latency."
                    </div>
                  </div>
                </div>

                {/* Worker Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs font-mono">
                  <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Queue System</div>
                    <div className="font-semibold text-foreground flex items-center space-x-1">
                      <Cpu className="w-3.5 h-3.5 text-foreground" />
                      <span>BullMQ Worker Stream</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Privacy Model</div>
                    <div className="font-semibold text-foreground flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Zero LLM Training Policy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 03 SHOWCASE: Dual Export */}
            {activeTab === 2 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Export Endpoints & Live Hosting Routes</span>
                    <span className="text-emerald-700 font-semibold">Active Dual Stream</span>
                  </div>

                  {/* Endpoints Table */}
                  <div className="bg-muted rounded-xl border border-border overflow-hidden text-xs font-mono">
                    <div className="p-3 bg-background border-b border-border flex items-center justify-between">
                      <span className="flex items-center space-x-2 font-semibold text-foreground">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>GET /u/:username</span>
                      </span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                        Live Subdomain &bull; SSL
                      </span>
                    </div>
                    <div className="p-3 bg-background border-b border-border flex items-center justify-between">
                      <span className="flex items-center space-x-2 font-semibold text-foreground">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>POST /api/cv/export-pdf</span>
                      </span>
                      <span className="text-foreground bg-muted px-2 py-0.5 rounded text-[10px] border border-border">
                        Vector PDF Stream
                      </span>
                    </div>
                    <div className="p-3 bg-background flex items-center justify-between">
                      <span className="flex items-center space-x-2 font-semibold text-foreground">
                        <FileCode className="w-4 h-4 text-amber-600" />
                        <span>GET /u/:username.llm.txt</span>
                      </span>
                      <span className="text-foreground bg-muted px-2 py-0.5 rounded text-[10px] border border-border">
                        AI-Readable Profile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feature Chips */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs font-mono">
                  <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">PDF Rendering</div>
                    <div className="font-semibold text-foreground flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>@react-pdf/renderer Engine</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/60 rounded-xl border border-border space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Domain Proxy</div>
                    <div className="font-semibold text-foreground flex items-center space-x-1">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Caddy Managed TLS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Footer Architecture Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground border-t border-border gap-2 font-mono">
              <span>
                Architecture: React Router v8 &bull; Express API &bull; Redis &bull; BullMQ
              </span>
              <a
                href="/login"
                className="text-foreground hover:underline font-semibold flex items-center"
              >
                Try It Free <ExternalLink className="ml-1 w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
