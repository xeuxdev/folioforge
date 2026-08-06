import { useState } from "react";
import {
  FileCode,
  Sparkles,
  Download,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export function SolutionSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const steps = [
    {
      number: "Step 01",
      title: "Store Your Canonical Resume Graph",
      description:
        "Define your master history once. Roles, achievements, metrics, education, and technical skills are structured in clean JSON schema with strict Zod types.",
      icon: FileCode,
      codeSnippet: `// Canonical Resume Graph Schema
export const ResumeSchema = z.object({
  contact: ContactInfoSchema,
  workExperience: z.array(WorkRoleSchema),
  skills: z.array(z.string()),
  education: z.array(EducationSchema),
});`,
      previewTitle: "Master Resume Graph",
    },
    {
      number: "Step 02",
      title: "AI Job Description Tailoring",
      description:
        "Paste a target job posting. BullMQ worker queues call LLM models to highlight matching keywords and suggest bullet refinements in an explicit diff viewer.",
      icon: Sparkles,
      codeSnippet: `// Tailored CV Bullet Diff Example
- "Managed team built services for user requests."
+ "Architected microservices handling 2M+ daily active sessions with 99.99% uptime."`,
      previewTitle: "Honest Keyword & Bullet Alignment",
    },
    {
      number: "Step 03",
      title: "Dual Output: PDF + Hosted Portfolio",
      description:
        "Export crisp vector PDFs and DOCX files for ATS job portals, while serving a responsive, SEO-optimized web portfolio at your custom subdomain.",
      icon: Download,
      codeSnippet: `// Dual Output Endpoints
GET  /u/alexmorgan       -> Hostable Web Portfolio
POST /api/cv/export-pdf  -> Vector PDF Stream via @react-pdf
POST /api/cv/export-docx -> ATS Word Document Stream`,
      previewTitle: "PDF Download & Web Portfolio",
    },
  ];

  return (
    <section
      id="solution"
      className="py-20 bg-muted/50 border-y border-border px-4 sm:px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
            Act III: The Solution
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-foreground font-semibold mt-4 tracking-tight">
            How FolioForge delivers speed, safety, and elegance.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Three simple steps transform fragmented resume notes into
            ATS-tailored applications and live hosted portfolio websites.
          </p>
        </div>

        {/* Step Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
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
                      ? "bg-card border-border shadow-xs"
                      : "bg-muted/30 border-transparent hover:bg-card/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
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

          {/* Interactive Code & Output Display */}
          <div className="lg:col-span-7 bg-card text-card-foreground rounded-2xl p-6 shadow-xs border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  {steps[activeTab].previewTitle}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-600 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Validated Engine</span>
              </span>
            </div>

            <pre className="font-mono text-xs text-foreground p-4 bg-muted/60 rounded-xl overflow-x-auto border border-border leading-relaxed">
              <code>{steps[activeTab].codeSnippet}</code>
            </pre>

            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
              <span>
                Output Architecture: Type-safe TypeScript &bull; Express API
                &bull; Redis &bull; BullMQ
              </span>
              <a
                href="/login"
                className="text-foreground hover:underline font-medium flex items-center"
              >
                Try It Free <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
