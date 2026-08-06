import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./logo";

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between"
        aria-label="Global Navigation"
      >
        <div className="flex items-center space-x-3">
          <a
            href="#"
            className="flex items-center group cursor-pointer"
          >
            <Logo className="w-8 h-8" showText={true} />
          </a>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
            Open Source
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => handleNavClick("problem")}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            The Problem
          </button>
          <button
            onClick={() => handleNavClick("philosophy")}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            Thought Process
          </button>
          <button
            onClick={() => handleNavClick("solution")}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            Solution
          </button>
          <button
            onClick={() => handleNavClick("pricing")}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            Pricing
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
          >
            GitHub
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("pricing");
            }}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
          >
            Start Free
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick("problem")}
            className="block w-full text-left py-2 text-base font-medium text-stone-700 hover:text-stone-900"
          >
            The Problem
          </button>
          <button
            onClick={() => handleNavClick("philosophy")}
            className="block w-full text-left py-2 text-base font-medium text-stone-700 hover:text-stone-900"
          >
            Thought Process
          </button>
          <button
            onClick={() => handleNavClick("solution")}
            className="block w-full text-left py-2 text-base font-medium text-stone-700 hover:text-stone-900"
          >
            Solution
          </button>
          <button
            onClick={() => handleNavClick("pricing")}
            className="block w-full text-left py-2 text-base font-medium text-stone-700 hover:text-stone-900"
          >
            Pricing
          </button>
          <div className="pt-4 border-t border-stone-200 flex flex-col space-y-2">
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("pricing");
              }}
              className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg"
            >
              Start Building Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
