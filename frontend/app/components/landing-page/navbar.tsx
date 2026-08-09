import { useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import { Logo } from "../logo";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleNavClick = (sectionId: string) => {
    setOpen(false);
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between"
        aria-label="Global Navigation"
      >
        <div className="flex items-center space-x-3">
          <a href="#" className="flex items-center group cursor-pointer">
            <Logo className="w-8 h-8" showText={true} />
          </a>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
            Open Source
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
          <button
            onClick={() => handleNavClick("problem")}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            The Problem
          </button>
          <button
            onClick={() => handleNavClick("philosophy")}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Thought Process
          </button>
          <button
            onClick={() => handleNavClick("solution")}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Solution
          </button>
          <button
            onClick={() => handleNavClick("pricing")}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Pricing
          </button>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-3">
          <a href="/login" className={buttonVariants({ variant: "ghost" })}>
            Sign In
          </a>
          <a href="/login" className={buttonVariants({ variant: "default" })}>
            Start Free
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </a>
        </div>

        {/* Mobile Menu with shadcn Sheet */}
        <div className="md:hidden flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle navigation menu"
                />
              }
            >
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="p-6">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 pt-6">
                <button
                  onClick={() => handleNavClick("problem")}
                  className="text-left py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  The Problem
                </button>
                <button
                  onClick={() => handleNavClick("philosophy")}
                  className="text-left py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Thought Process
                </button>
                <button
                  onClick={() => handleNavClick("solution")}
                  className="text-left py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Solution
                </button>
                <button
                  onClick={() => handleNavClick("pricing")}
                  className="text-left py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </button>
                <div className="pt-6 border-t border-border flex flex-col space-y-3">
                  <a
                    href="/login"
                    className={buttonVariants({
                      variant: "outline",
                      className: "w-full",
                    })}
                  >
                    Sign In
                  </a>
                  <a
                    href="/login"
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full",
                    })}
                  >
                    Start Free
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
