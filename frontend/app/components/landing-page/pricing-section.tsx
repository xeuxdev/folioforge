import { Check, Terminal, Server, ArrowRight } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          Act IV: Transparent Pricing
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl text-foreground font-semibold mt-4 tracking-tight">
          No credit card traps. Zero subscription surprises.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Self-host the entire stack for free on your own server, or pick our
          low-cost managed cloud instance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Tier 1: Self-Hosted Community */}
        <div className="bg-card p-8 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                Community Edition
              </span>
              <Terminal className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Self-Hosted</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Deploy on your local machine or VPS with Docker Compose in under 2
              minutes.
            </p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-foreground">
                $0
              </span>
              <span className="ml-2 text-sm text-muted-foreground font-medium">
                Free Forever
              </span>
            </div>

            <ul className="mt-8 space-y-3.5 text-sm text-foreground">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
                <span>100% Full Source Code Access</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
                <span>Unlimited Resume Variants & Tailoring</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
                <span>Unlimited PDF & DOCX Exports</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
                <span>PostgreSQL & Redis Local Persistence</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
                <span>Bring Your Own OpenAI / Ollama Key</span>
              </li>
            </ul>
          </div>

          <div className="mt-10">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({
                variant: "outline",
                className: "w-full py-6 text-sm font-semibold",
              })}
            >
              Deploy via Docker
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tier 2: Managed Cloud */}
        <div className="bg-primary text-primary-foreground p-8 rounded-2xl border border-primary shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80 bg-primary-foreground/10 px-2.5 py-1 rounded-md border border-primary-foreground/20">
                Managed Pro Cloud
              </span>
              <Server className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-primary-foreground">
              Cloud Managed
            </h3>
            <p className="text-sm text-primary-foreground/80 mt-2">
              We host and manage the infrastructure, SSL subdomains, and LLM
              processing for you.
            </p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-primary-foreground">
                $9
              </span>
              <span className="ml-2 text-sm text-primary-foreground/70 font-medium">
                / month or $79/yr
              </span>
            </div>

            <ul className="mt-8 space-y-3.5 text-sm text-primary-foreground/90">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                <span>Everything in Self-Hosted</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                <span>Custom Subdomain (yourname.folioforge.com)</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                <span>Automated TLS & Managed Caddy Proxy</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                <span>Built-in Fast AI Tailoring Credits</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-400 mr-3 shrink-0" />
                <span>1-Click Cancel Any Time with Zero Lock-In</span>
              </li>
            </ul>
          </div>

          <div className="mt-10">
            <a
              href="/login"
              className={buttonVariants({
                variant: "secondary",
                className: "w-full py-6 text-sm font-semibold cursor-pointer",
              })}
            >
              Start Free 14-Day Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
