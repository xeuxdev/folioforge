import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Globe,
  Code2,
  Sparkles,
  Zap,
  Check,
  Layers,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";

interface PresetRole {
  id: string;
  label: string;
  targetCompany: string;
  roleTitle: string;
  matchScore: number;
  skills: string[];
  originalBullet: string;
  tailoredBullet: string;
  jsonCode: string;
}

const PRESET_ROLES: PresetRole[] = [
  {
    id: "fullstack",
    label: "Full-Stack Engineer",
    targetCompany: "Vercel / Stripe",
    roleTitle: "Senior Full-Stack Engineer",
    matchScore: 98,
    skills: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Redis", "Docker"],
    originalBullet: "Built backend services for web application processing user data.",
    tailoredBullet: "Architected Node.js & Redis microservices handling 2.4M+ daily active sessions with 99.99% uptime and <45ms p99 latency.",
    jsonCode: `{
  "role": "Senior Full-Stack Engineer",
  "company": "Xeux Labs",
  "period": "2023 - Present",
  "skills": ["TypeScript", "Node.js", "PostgreSQL", "Redis"],
  "impact": [
    "Architected Node.js & Redis microservices handling 2.4M+ daily active sessions.",
    "Reduced candidate search query latency by 42% using indexed PostgreSQL schemas."
  ]
}`,
  },
  {
    id: "aiml",
    label: "AI Platform Engineer",
    targetCompany: "Anthropic / OpenAI",
    roleTitle: "Staff AI Infrastructure Lead",
    matchScore: 99,
    skills: ["Python", "PyTorch", "vLLM", "CUDA", "Ray", "Kubernetes"],
    originalBullet: "Ran machine learning models on server instances for text generation.",
    tailoredBullet: "Engineered high-throughput vLLM inference clusters, reducing model inference latency by 64% while scaling to 500+ requests/sec.",
    jsonCode: `{
  "role": "Staff AI Infrastructure Lead",
  "company": "TensorCraft AI",
  "period": "2022 - Present",
  "skills": ["Python", "PyTorch", "vLLM", "Kubernetes"],
  "impact": [
    "Engineered vLLM inference clusters scaling to 500+ requests/sec.",
    "Streamlined LLM fine-tuning pipelines using Distributed Data Parallel."
  ]
}`,
  },
  {
    id: "frontend",
    label: "Frontend Architect",
    targetCompany: "Figma / Linear",
    roleTitle: "Principal Design Systems Architect",
    matchScore: 97,
    skills: ["React", "Tailwind CSS", "WebAssembly", "Canvas", "Performance"],
    originalBullet: "Created UI components and styled pages according to design drafts.",
    tailoredBullet: "Spearheaded design system UI kit adopted across 14 product teams, improving core web vitals score to 99/100 across 5M monthly visitors.",
    jsonCode: `{
  "role": "Principal Design Systems Architect",
  "company": "Canvas Studio",
  "period": "2021 - Present",
  "skills": ["React", "Tailwind CSS", "WebAssembly"],
  "impact": [
    "Spearheaded design system UI kit adopted across 14 engineering teams.",
    "Optimized canvas render cycles reducing bundle footprint by 38%."
  ]
}`,
  },
];

export function HeroSection() {
  const [selectedRole, setSelectedRole] = useState<PresetRole>(PRESET_ROLES[0]);
  const [activeTab, setActiveTab] = useState<"graph" | "pdf" | "web">("pdf");
  const [isTailoring, setIsTailoring] = useState<boolean>(false);
  const [appliedTailor, setAppliedTailor] = useState<boolean>(true);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyTailor = () => {
    setIsTailoring(true);
    setTimeout(() => {
      setAppliedTailor(true);
      setIsTailoring(false);
    }, 400);
  };

  return (
    <section className="pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto text-center">
      {/* Category Badge Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-foreground text-xs font-medium tracking-wide uppercase mb-8">
        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
        <span>Self-Hosted &bull; Type-Safe &bull; Zero Paywalls</span>
      </div>

      {/* Main Headline */}
      <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] max-w-5xl mx-auto">
        Your career history belongs in code, not trapped behind paywalls.
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed">
        FolioForge is the open-source CV engine and portfolio generator. Store your experiences in structured, Zod-validated JSON graphs, tailor bullet points accurately with AI, and export ATS-perfect vector PDFs or custom subdomains.
      </p>

      {/* Primary & Secondary Action CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="/login"
          className={buttonVariants({
            size: "lg",
            className: "w-full sm:w-auto px-7 py-6 text-base font-semibold shadow-none rounded-xl",
          })}
        >
          Start Building Free
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
        <Button
          variant="outline"
          size="lg"
          onClick={() => scrollToSection("solution")}
          className="w-full sm:w-auto px-7 py-6 text-base font-semibold cursor-pointer rounded-xl"
        >
          See How Engine Works
        </Button>
      </div>

      {/* Feature Highlights Bar */}
      <div className="mt-12 pt-8 border-t border-border max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-12 text-xs sm:text-sm font-medium text-muted-foreground">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Data Ownership</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Vector ATS PDF Stream</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Docker One-Command Deploy</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WOW MOMENT: INTERACTIVE LIVE CV & PORTFOLIO ENGINE SIMULATOR */}
      {/* ========================================================================= */}
      <div className="mt-14 max-w-6xl mx-auto bg-card border border-border rounded-2xl text-left overflow-hidden">
        {/* Browser Top Bar */}
        <div className="bg-muted/60 px-4 py-3 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
            </div>
            <div className="flex items-center space-x-2 bg-background px-3 py-1 rounded-md border border-border text-xs font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>app.folioforge.dev/editor</span>
            </div>
          </div>

          {/* Output Mode Selector Tabs */}
          <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("graph")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "graph"
                  ? "bg-background text-foreground font-semibold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>JSON Graph</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pdf")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "pdf"
                  ? "bg-background text-foreground font-semibold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>ATS PDF Output</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("web")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "web"
                  ? "bg-background text-foreground font-semibold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Web Portfolio</span>
            </button>
          </div>
        </div>

        {/* Role Preset Selector Bar */}
        <div className="bg-muted/30 px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 font-medium text-muted-foreground">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Target Role Preset:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role);
                  setAppliedTailor(true);
                }}
                className={`px-3 py-1 rounded-md border text-xs transition-all cursor-pointer ${
                  selectedRole.id === role.id
                    ? "bg-primary text-primary-foreground border-primary font-medium"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Simulator Grid */}
        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-card text-card-foreground">
          {/* Left Column: AI Alignment & Diff Control */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Alignment Score</span>
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedRole.matchScore}% ATS Score
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="text-muted-foreground font-medium">Target Company:</div>
                <div className="font-semibold text-foreground">{selectedRole.targetCompany}</div>
              </div>

              {/* Skills badges */}
              <div className="text-xs space-y-1.5">
                <div className="text-muted-foreground font-medium">Extracted Keywords:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRole.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-background border border-border text-foreground text-[11px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bullet Diff & AI Optimization Button */}
            <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-border pb-2">
                <span className="font-bold text-foreground font-mono">Bullet Point Tailoring</span>
                <button
                  type="button"
                  onClick={() => setAppliedTailor(!appliedTailor)}
                  className="text-xs font-semibold text-foreground underline hover:text-muted-foreground cursor-pointer"
                >
                  {appliedTailor ? "Show Original" : "Apply AI Tailor"}
                </button>
              </div>

              <div className="text-xs leading-relaxed font-mono">
                {appliedTailor ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-md text-emerald-950 space-y-1">
                    <div className="flex items-center space-x-1 font-bold text-[10px] text-emerald-800 uppercase tracking-wider">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Tailored for ATS Impact</span>
                    </div>
                    <p className="text-[11px]">{selectedRole.tailoredBullet}</p>
                  </div>
                ) : (
                  <div className="bg-muted p-2.5 rounded-md text-muted-foreground space-y-1 border border-border">
                    <div className="font-bold text-[10px] uppercase tracking-wider">
                      Original Draft
                    </div>
                    <p className="text-[11px]">{selectedRole.originalBullet}</p>
                  </div>
                )}
              </div>

              <Button
                type="button"
                size="sm"
                onClick={handleApplyTailor}
                disabled={isTailoring}
                className="w-full text-xs font-semibold rounded-lg py-2 cursor-pointer"
              >
                {isTailoring ? (
                  <span className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></span>
                    <span>Optimizing Bullets...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Run Real-Time AI Optimization</span>
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column: Dynamic Preview Screen */}
          <div className="lg:col-span-7 bg-muted/40 rounded-xl border border-border p-4 space-y-3 flex flex-col justify-between">
            {/* View 1: JSON Graph */}
            {activeTab === "graph" && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
                  <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
                    Canonical Resume Graph (Zod Validated)
                  </span>
                  <span className="text-[10px]">resumes.json</span>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto leading-relaxed text-[11px] text-foreground border border-border">
                  <code>{selectedRole.jsonCode}</code>
                </pre>
              </div>
            )}

            {/* View 2: ATS PDF Preview */}
            {activeTab === "pdf" && (
              <div className="bg-background p-5 rounded-lg border border-border space-y-4 text-xs font-sans text-foreground">
                <div className="border-b border-border pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      Alex Morgan
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      alex.morgan@dev.io &bull; github.com/alexmorgan &bull; San Francisco, CA
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    Vector ATS Standard
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-xs uppercase tracking-wider font-bold text-foreground border-b border-border pb-1">
                    Work Experience
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between font-semibold text-foreground">
                      <span>{selectedRole.roleTitle} &bull; Xeux Labs</span>
                      <span className="text-muted-foreground font-mono text-[11px]">2023 - Present</span>
                    </div>
                    <ul className="list-disc pl-4 text-muted-foreground space-y-1 text-[11.5px] leading-relaxed">
                      <li>
                        {appliedTailor ? selectedRole.tailoredBullet : selectedRole.originalBullet}
                      </li>
                      <li>
                        Reduced candidate search query latency by 42% using indexed PostgreSQL schemas and Redis cache invalidation.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border">
                  <div className="font-mono text-xs uppercase tracking-wider font-bold text-foreground">
                    Core Technical Skills
                  </div>
                  <p className="text-muted-foreground font-mono text-[11px]">
                    {selectedRole.skills.join(" • ")}
                  </p>
                </div>
              </div>
            )}

            {/* View 3: Web Portfolio */}
            {activeTab === "web" && (
              <div className="bg-background rounded-lg border border-border p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
                      AM
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">alex.folioforge.dev</div>
                      <div className="text-[10px] text-muted-foreground">Live Hosted Portfolio</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-muted text-foreground px-2 py-0.5 rounded border border-border font-semibold">
                    Subdomain SSL Active
                  </span>
                </div>

                <div className="space-y-3 text-left">
                  <div className="bg-muted/50 p-3 rounded-lg border border-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                      Current Focus
                    </span>
                    <h4 className="text-sm font-bold text-foreground mt-0.5">{selectedRole.roleTitle}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {appliedTailor ? selectedRole.tailoredBullet : selectedRole.originalBullet}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-muted/50 rounded-lg border border-border">
                      <div className="text-[10px] text-muted-foreground font-mono">PDF Resume</div>
                      <div className="font-semibold text-foreground mt-0.5">Vector Export Ready</div>
                    </div>
                    <div className="p-2.5 bg-muted/50 rounded-lg border border-border">
                      <div className="text-[10px] text-muted-foreground font-mono">Data Source</div>
                      <div className="font-semibold text-foreground mt-0.5">Self-Hosted PostgreSQL</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Status Indicator Bar */}
            <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between text-[11px] text-muted-foreground font-mono gap-2">
              <span className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-foreground" />
                <span>Zero Canvas Bloat &bull; Pure Vector Engine</span>
              </span>
              <span className="text-emerald-700 font-semibold">
                100% Deterministic Output
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
