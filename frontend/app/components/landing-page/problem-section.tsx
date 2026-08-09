import { Lock, FileX2, Bot, AlertCircle } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: Lock,
      title: "Subscription Traps & Mandatory Paywalls",
      description:
        "You spend hours tailoring your CV for an urgent interview, only to be forced into an ongoing monthly subscription when you click export.",
      impact: "Impact: Loss of data portability, surprise charges, and locked PDF files.",
    },
    {
      icon: FileX2,
      title: "The ATS Parsing Black Hole",
      description:
        "Visual drag-and-drop builders generate messy DOM layouts, multi-column tables, and raster graphics that fail automated ATS parsers before recruiters ever see them.",
      impact: "Impact: Silent rejection by recruitment parsing pipelines.",
    },
    {
      icon: Bot,
      title: "AI Hallucinations & Fabrication",
      description:
        "Generic LLM wrapper tools invent metrics, exaggerate responsibilities, and generate fluff bullets that crumble during technical interviews.",
      impact: "Impact: Severe risk to professional reputation and engineering trust.",
    },
  ];

  return (
    <section
      id="problem"
      className="py-20 md:py-28 bg-muted/40 border-y border-border px-4 sm:px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
            Act I: The Status Quo
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-foreground font-bold mt-4 tracking-tight">
            Why modern resume builders feel broken.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Most commercial CV services prioritize recurring SaaS revenue over candidate outcomes. They turn essential career document creation into a hostile user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className="bg-card text-card-foreground p-8 rounded-2xl border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">
                    {problem.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border text-xs font-mono font-medium text-muted-foreground flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span>{problem.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
