import { Database, Cpu, CheckSquare, Layers } from "lucide-react";

export function ThoughtProcessSection() {
  const pillars = [
    {
      step: "01",
      title: "Canonical Resume Graph",
      description:
        "Your career experience lives inside a strict Zod-validated TypeScript schema. Edit once in your master graph, and instantly export to any template or format without re-keying data.",
      detail: "PostgreSQL + Drizzle ORM Schema",
      icon: Database,
    },
    {
      step: "02",
      title: "Headless React PDF Engine",
      description:
        "We eliminated heavy Chromium browser dependencies. Using @react-pdf/renderer in worker streams, PDFs compile cleanly with true vector fonts and standard text flow for ATS compliance.",
      detail: "Zero Puppeteer or Playwright Overhead",
      icon: Cpu,
    },
    {
      step: "03",
      title: "Side-by-Side Diff Verification",
      description:
        "When tailoring for specific job descriptions, AI suggestions are presented in a split diff viewer. You accept or tweak line-by-line, ensuring 100% truthfulness and alignment.",
      detail: "Human-in-the-loop AI Tailoring",
      icon: CheckSquare,
    },
  ];

  return (
    <section
      id="philosophy"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          Act II: Our Thought Process
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl text-foreground font-bold mt-4 tracking-tight">
          A career resume is structured data, not a print canvas.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          We approached FolioForge with software engineering rigor: separate content from presentation, enforce schema safety, and make output deterministic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.step}
              className="bg-card text-card-foreground border border-border p-8 rounded-2xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-sm">
                    {pillar.step}
                  </div>
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border text-xs font-mono text-muted-foreground flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{pillar.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
