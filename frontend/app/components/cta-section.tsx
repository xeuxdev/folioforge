import { ArrowRight, Code2 } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 bg-stone-100 border-t border-stone-200 px-4 sm:px-6 lg:px-12 text-center">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="font-heading text-3xl sm:text-5xl text-stone-900 font-semibold tracking-tight">
          Ready to own your career presentation?
        </h2>
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Join engineers, designers, and product leaders who build type-safe CVs and self-hosted portfolios without paywalls or privacy trade-offs.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-sm"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-all"
          >
            <Code2 className="mr-2 w-5 h-5" />
            View Repository on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
