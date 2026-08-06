import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Globe,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto text-center">
      {/* Category Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-foreground text-xs font-semibold tracking-wide uppercase mb-6">
        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
        <span>Self-Hosted &bull; Type-Safe &bull; Zero Paywalls</span>
      </div>

      {/* Centered Heading */}
      <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.12] max-w-6xl mx-auto">
        Your career story deserves better than generic templates and vendor
        lock-in.
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed">
        FolioForge is an open-source CV builder and portfolio generator. Define
        your career history once in a structured graph, tailor bullet points
        accurately with AI, and publish to ATS-perfect PDFs or custom
        subdomains.
      </p>

      {/* Primary & Secondary CTAs with shadcn Button */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="/login"
          className={buttonVariants({
            size: "lg",
            className: "w-full sm:w-auto px-6 py-6 text-base font-semibold",
          })}
        >
          Get Started Free
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
        <Button
          variant="outline"
          size="lg"
          onClick={() => scrollToSection("problem")}
          className="w-full sm:w-auto px-6 py-6 text-base font-semibold cursor-pointer"
        >
          Read Our Thought Process
        </Button>
      </div>

      {/* Value Highlights */}
      <div className="mt-10 pt-8 border-t border-border max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-10 text-sm font-medium text-muted-foreground">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>100% Data Ownership</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Vector ATS PDF Engine</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Self-Hostable with Docker</span>
        </div>
      </div>

      {/* Preview Card Mockup */}
      <div className="mt-14 relative max-w-6xl mx-auto bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs text-left overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-6 gap-3 sm:gap-0">
          <div className="flex items-center min-w-0">
            <div className="flex space-x-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
            </div>
            <span className="ml-2.5 text-xs font-mono text-muted-foreground truncate">
              app.folioforge.internal/editor
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
            <span className="inline-flex items-center space-x-1 bg-muted px-2.5 py-1 rounded-md border border-border whitespace-nowrap">
              <FileText className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>ATS PDF Sync</span>
            </span>
            <span className="inline-flex items-center space-x-1 bg-muted px-2.5 py-1 rounded-md border border-border whitespace-nowrap">
              <Globe className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>alex.folioforge.com</span>
            </span>
          </div>
        </div>

        {/* Dual Split Mockup View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Canonical Graph view */}
          <div className="bg-muted/40 p-4 rounded-xl border border-border font-mono text-xs text-foreground space-y-3 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between text-muted-foreground border-b border-border pb-2 gap-1">
              <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                Canonical Graph (Zod Validated)
              </span>
              <span className="text-[10px]">resumes.json</span>
            </div>
            <div className="space-y-1.5 leading-relaxed text-foreground wrap-break-word">
              <div>
                <span className="text-muted-foreground">role:</span>{" "}
                <span className="text-foreground font-semibold">
                  "Senior Full-Stack Engineer"
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">company:</span>{" "}
                <span className="text-foreground font-semibold">
                  "Xeux Labs"
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">period:</span> "2023 -
                Present"
              </div>
              <div>
                <span className="text-muted-foreground">impact_bullets:</span> [
              </div>
              <div className="pl-3 sm:pl-4 text-foreground wrap-break-word">
                &bull; "Architected Node.js microservices serving 2M+ active
                sessions daily."
              </div>
              <div className="pl-3 sm:pl-4 text-foreground wrap-break-word">
                &bull; "Reduced candidate search latency by 42% using PostgreSQL
                indexes."
              </div>
              <div>]</div>
            </div>
          </div>

          {/* Rendered output preview */}
          <div className="bg-card p-5 rounded-xl border border-border space-y-4 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 gap-2">
              <div>
                <h3 className="font-bold text-foreground text-base">
                  Alex Morgan
                </h3>
                <p className="text-xs text-muted-foreground break-all">
                  Senior Full-Stack Engineer &bull; alexmorgan.dev
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded whitespace-nowrap">
                Live Output
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap justify-between font-semibold text-foreground gap-1">
                <span>Xeux Labs - Senior Full-Stack Engineer</span>
                <span className="text-muted-foreground">2023 - Present</span>
              </div>
              <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                <li className="wrap-break-word">
                  Architected Node.js microservices serving 2M+ active sessions
                  daily.
                </li>
                <li className="wrap-break-word">
                  Reduced candidate search latency by 42% using PostgreSQL
                  indexes.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
