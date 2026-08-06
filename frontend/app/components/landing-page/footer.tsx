import { Logo } from "../logo";
import { Code2, Shield, Terminal, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand Info (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <a href="#" className="inline-block">
              <Logo className="w-8 h-8" showText={true} />
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The self-hosted, type-safe CV builder and portfolio generator.
              Store your career history in a canonical JSON graph, tailor bullet
              points accurately, and export ATS-perfect documents.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Open Source (MIT)</span>
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
                <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Column 2: Story & Features */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Product Story
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="#problem"
                  className="hover:text-foreground transition-colors"
                >
                  The Status Quo
                </a>
              </li>
              <li>
                <a
                  href="#philosophy"
                  className="hover:text-foreground transition-colors"
                >
                  Thought Process
                </a>
              </li>
              <li>
                <a
                  href="#solution"
                  className="hover:text-foreground transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing & Self-Hosting
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Architecture */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Architecture
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>React Router v8</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Tailwind CSS v4</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>PostgreSQL + Drizzle</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>BullMQ & Redis Workers</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>React PDF Renderer</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Privacy */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Legal & Safety
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="/privacy"
                  className="hover:text-foreground transition-colors flex items-center space-x-1"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy#data-ownership"
                  className="hover:text-foreground transition-colors"
                >
                  Data Ownership
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="hover:text-foreground transition-colors"
                >
                  Google Sign-In
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} FolioForge. Built for developers
            by Xeux Labs.
          </p>

          <div className="flex items-center space-x-4 font-mono text-[11px] text-muted-foreground">
            <span>Type-Safe Graph</span>
            <span>&bull;</span>
            <span>Vector ATS PDF</span>
            <span>&bull;</span>
            <span>Subdomain Routing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
