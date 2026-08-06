import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Globe,
} from "lucide-react";

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
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold tracking-wide uppercase mb-6">
        <ShieldCheck className="w-4 h-4 text-stone-700" />
        <span>Self-Hosted &bull; Type-Safe &bull; Zero Paywalls</span>
      </div>

      {/* Centered Heading with Inter */}
      <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-stone-900 leading-[1.12] max-w-6xl mx-auto">
        Your career story deserves better than generic templates and vendor
        lock-in.
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto font-normal leading-relaxed">
        FolioForge is an open-source CV builder and portfolio generator. Define
        your career history once in a structured graph, tailor bullet points
        accurately with AI, and publish to ATS-perfect PDFs or custom
        subdomains.
      </p>

      {/* Primary & Secondary CTAs */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollToSection("solution")}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Explore How It Works
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("problem")}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-all cursor-pointer"
        >
          Read Our Thought Process
        </button>
      </div>

      {/* Value Highlights */}
      <div className="mt-10 pt-8 border-t border-stone-200 max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-10 text-sm font-medium text-stone-600">
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
      <div className="mt-14 relative max-w-6xl mx-auto bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-sm text-left overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-4 mb-6 gap-3 sm:gap-0">
          <div className="flex items-center min-w-0">
            <div className="flex space-x-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-stone-300"></div>
              <div className="w-3 h-3 rounded-full bg-stone-300"></div>
              <div className="w-3 h-3 rounded-full bg-stone-300"></div>
            </div>
            <span className="ml-2.5 text-xs font-mono text-stone-500 truncate">
              app.folioforge.internal/editor
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-medium">
            <span className="inline-flex items-center space-x-1 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200 whitespace-nowrap">
              <FileText className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              <span>ATS PDF Sync</span>
            </span>
            <span className="inline-flex items-center space-x-1 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200 whitespace-nowrap">
              <Globe className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              <span>alex.folioforge.com</span>
            </span>
          </div>
        </div>

        {/* Dual Split Mockup View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Canonical Graph view */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono text-xs text-stone-800 space-y-3 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between text-stone-500 border-b border-stone-200 pb-2 gap-1">
              <span className="font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                Canonical Graph (Zod Validated)
              </span>
              <span className="text-[10px]">resumes.json</span>
            </div>
            <div className="space-y-1.5 leading-relaxed text-stone-700 wrap-break-word">
              <div>
                <span className="text-stone-400">role:</span>{" "}
                <span className="text-stone-900 font-semibold">
                  "Senior Full-Stack Engineer"
                </span>
              </div>
              <div>
                <span className="text-stone-400">company:</span>{" "}
                <span className="text-stone-900 font-semibold">
                  "Xeux Labs"
                </span>
              </div>
              <div>
                <span className="text-stone-400">period:</span> "2023 - Present"
              </div>
              <div>
                <span className="text-stone-400">impact_bullets:</span> [
              </div>
              <div className="pl-3 sm:pl-4 text-stone-800 wrap-break-word">
                &bull; "Architected Node.js microservices serving 2M+ active
                sessions daily."
              </div>
              <div className="pl-3 sm:pl-4 text-stone-800 wrap-break-word">
                &bull; "Reduced candidate search latency by 42% using PostgreSQL
                indexes."
              </div>
              <div>]</div>
            </div>
          </div>

          {/* Rendered output preview */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-4 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between border-b border-stone-100 pb-3 gap-2">
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  Alex Morgan
                </h3>
                <p className="text-xs text-stone-500 break-all">
                  Senior Full-Stack Engineer &bull; alexmorgan.dev
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-stone-900 text-stone-50 px-2 py-0.5 rounded whitespace-nowrap">
                Live Output
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap justify-between font-semibold text-stone-800 gap-1">
                <span>Xeux Labs - Senior Full-Stack Engineer</span>
                <span className="text-stone-400">2023 - Present</span>
              </div>
              <ul className="list-disc pl-4 text-stone-600 space-y-1">
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
