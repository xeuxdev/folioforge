import { Database, Cpu, CheckSquare } from "lucide-react";

export function ThoughtProcessSection() {
  return (
    <section id="philosophy" className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          Act II: Our Thought Process
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl text-foreground font-semibold mt-4 tracking-tight">
          A career resume is structured data, not a print canvas.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          We approached FolioForge with software engineering rigor: separate content from presentation, enforce schema safety, and make output deterministic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pillar 1 */}
        <div className="bg-card border border-border p-8 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-foreground">Canonical Resume Graph</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your career experience live inside a strict Zod-validated TypeScript schema. Edit once in your master graph, and instantly export to any template or format without re-keying data.
          </p>
          <div className="pt-2 text-xs font-mono text-muted-foreground flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-foreground" />
            <span>PostgreSQL + Drizzle ORM Schema</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-card border border-border p-8 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-foreground">Headless React PDF Engine</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We eliminated heavy Chromium browser setups. Using `@react-pdf/renderer` directly in Node.js worker streams, PDFs compile cleanly with true vector fonts and standard text flow for ATS compliance.
          </p>
          <div className="pt-2 text-xs font-mono text-muted-foreground flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-foreground" />
            <span>Zero Puppeteer/Playwright Overhead</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-card border border-border p-8 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-foreground">Side-by-Side Diff Verification</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When tailoring for specific job descriptions, AI suggestions are presented in a split diff viewer. You accept or tweak line-by-line, ensuring 100% truthfulness and alignment.
          </p>
          <div className="pt-2 text-xs font-mono text-muted-foreground flex items-center space-x-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-foreground" />
            <span>Human-in-the-loop AI Tailoring</span>
          </div>
        </div>
      </div>
    </section>
  );
}
