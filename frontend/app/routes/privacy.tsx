import type { Route } from "./+types/privacy";
import { ArrowLeft, ShieldCheck, Database } from "lucide-react";
import { Logo } from "../components/logo";
import { Footer } from "../components/landing-page/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy | FolioForge" },
    {
      name: "description",
      content:
        "FolioForge privacy policy outlining 100% self-hosted data ownership and Google OAuth authentication guidelines.",
    },
  ];
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center group cursor-pointer">
            <Logo className="w-8 h-8" showText={true} />
          </a>
          <a
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-1.5 w-4 h-4" />
            Back to home
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-4">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Self-Hosted & Private</span>
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Last Updated: August 6, 2026
          </p>
        </div>

        {/* Highlight Callout Box */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-foreground font-semibold text-base">
            <Database className="w-5 h-5 text-foreground" />
            <h2>100% Data Ownership & Self-Hosted Architecture</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            FolioForge is engineered for complete data autonomy. When you host FolioForge, your canonical resume graph, job tailoring records, exported documents, and user sessions are stored exclusively in your dedicated PostgreSQL instance. We do not sell, track, or monetise your personal career history.
          </p>
        </div>

        <div className="space-y-8 text-foreground leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              When authenticating via Google OAuth 2.0, FolioForge requests access solely to your basic Google profile information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Primary email address (`email`)</li>
              <li>Display name (`name`)</li>
              <li>Google account identifier (`google_id`)</li>
              <li>Profile picture URL (`avatar_url`)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. How We Use Authentication Data</h2>
            <p className="text-muted-foreground">
              Google OAuth data is used strictly for identity verification and account provisioning within your local PostgreSQL `users` table. We do not request access to Google Drive, Gmail, or any unrelated Google service scopes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Session Security & Cookies</h2>
            <p className="text-muted-foreground">
              Sessions are maintained using stateful session tokens backed by PostgreSQL. Tokens are transmitted to your client browser inside secure HTTP-only cookies (`HttpOnly`, `SameSite=Lax`, `Secure`).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Account Deletion & Right to Erase</h2>
            <p className="text-muted-foreground">
              You maintain total control over your records. Triggering account deletion purges your user profile, Google authentication metadata, canonical resume graphs, tailored bullet variations, and hosted portfolio subdomains permanently.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
