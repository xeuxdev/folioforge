import type { Route } from "./+types/home";
import { Navbar } from "../components/landing-page/navbar";
import { HeroSection } from "../components/landing-page/hero-section";
import { ProblemSection } from "../components/landing-page/problem-section";
import { ThoughtProcessSection } from "../components/landing-page/thought-process-section";
import { SolutionSection } from "../components/landing-page/solution-section";
import { PricingSection } from "../components/landing-page/pricing-section";
import { CtaSection } from "../components/landing-page/cta-section";
import { Footer } from "../components/landing-page/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FolioForge | Self-Hosted AI CV Builder & Portfolio Generator" },
    {
      name: "description",
      content:
        "Define your career history in structured type-safe JSON graphs, tailor bullets with AI, and export ATS-compliant PDFs or host personal portfolios with zero paywalls.",
    },
    {
      name: "keywords",
      content:
        "CV builder, resume generator, self-hosted, ATS PDF, react-pdf, Zod resume schema, portfolio builder, open source",
    },
    { name: "author", content: "FolioForge" },
    { property: "og:type", content: "website" },
    {
      property: "og:title",
      content: "FolioForge | Self-Hosted AI CV Builder & Portfolio Generator",
    },
    {
      property: "og:description",
      content:
        "Define your career history in structured type-safe JSON graphs, tailor bullets with AI, and export ATS-compliant PDFs or host personal portfolios with zero paywalls.",
    },
    { property: "og:image", content: "/og-image.png" },
    { property: "og:url", content: "https://folioforge.dev" },
    { property: "og:site_name", content: "FolioForge" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "FolioForge | Self-Hosted AI CV Builder & Portfolio Generator",
    },
    {
      name: "twitter:description",
      content:
        "Define your career history in structured type-safe JSON graphs, tailor bullets with AI, and export ATS-compliant PDFs or host personal portfolios with zero paywalls.",
    },
    { name: "twitter:image", content: "/og-image.png" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-muted selection:text-foreground">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <ThoughtProcessSection />
        <SolutionSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
