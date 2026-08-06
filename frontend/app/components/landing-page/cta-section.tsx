import { ArrowRight, Code2 } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 bg-muted/50 border-t border-border px-4 sm:px-6 lg:px-12 text-center">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="font-heading text-3xl sm:text-5xl text-foreground font-semibold tracking-tight">
          Ready to own your career presentation?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Join engineers, designers, and product leaders who build type-safe CVs and self-hosted portfolios without paywalls or privacy trade-offs.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto px-6 py-6 text-base font-semibold",
            })}
          >
            <Code2 className="mr-2 w-5 h-5" />
            View Repository on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
