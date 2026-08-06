import type { Route } from "./+types/terms";
import { ArrowLeft, FileText } from "lucide-react";
import { Logo } from "../components/logo";
import { Footer } from "../components/landing-page/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Service | FolioForge" },
    {
      name: "description",
      content:
        "FolioForge terms of service outlining open-source usage, licensing, and self-hosted platform guidelines.",
    },
  ];
}

export default function Terms() {
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
            <FileText className="w-4 h-4 text-foreground" />
            <span>Open Source License</span>
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Last Updated: August 6, 2026
          </p>
        </div>

        <div className="space-y-8 text-foreground leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By deploying, installing, or accessing FolioForge (whether self-hosted or via our managed cloud service), you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Open Source Licensing</h2>
            <p className="text-muted-foreground">
              FolioForge is distributed under the MIT Open Source License. You are free to inspect, modify, fork, and self-host the source code on your private infrastructure without hidden fees or vendor lock-in.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. User Responsibilities & Content Accuracy</h2>
            <p className="text-muted-foreground">
              You retain full ownership and responsibility for the career data, bullet points, skills, and links stored in your canonical resume graph. FolioForge provides AI-assisted tailoring tools as recommendations; you are responsible for reviewing and verifying all exported documents.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              The software is provided "as is", without warranty of any kind, express or implied. In no event shall the authors or copyright holders be liable for any claim or damages arising from the use of the software.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
