import { useState } from "react";
import { Menu, Upload, Sparkles, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Logo } from "../logo";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

interface TopbarProps {
  title: string;
  subtitle?: string;
  currentPath: string;
}

export function Topbar({ title, subtitle, currentPath }: TopbarProps) {
  const [open, setOpen] = useState<boolean>(false);

  const navItems = [
    { label: "Master Resume Graph", href: "/dashboard" },
    { label: "Upload & Parse CV", href: "/dashboard/import" },
    { label: "AI Tailoring Engine", href: "/dashboard/tailor" },
    { label: "Portfolio Site", href: "/dashboard/portfolio" },
    { label: "Account & Data", href: "/dashboard/settings" },
  ];

  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        {/* Mobile menu trigger */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open sidebar menu" />}>
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center space-x-2">
                  <Logo className="w-7 h-7" showText={true} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-2 pt-6">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({
                      variant: currentPath === item.href ? "secondary" : "ghost",
                      className: "w-full justify-start text-sm",
                    })}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <a
          href="/dashboard/import"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "hidden sm:inline-flex text-xs",
          })}
        >
          <Upload className="mr-1.5 w-3.5 h-3.5" />
          Import Resume
        </a>
        <a
          href="/dashboard/tailor"
          className={buttonVariants({
            size: "sm",
            className: "text-xs font-semibold",
          })}
        >
          <Sparkles className="mr-1.5 w-3.5 h-3.5" />
          Tailor for Job
        </a>
        <a
          href="https://alex.folioforge.com"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "hidden md:inline-flex text-xs text-muted-foreground hover:text-foreground",
          })}
        >
          <span>alex.folioforge.com</span>
          <ExternalLink className="ml-1 w-3 h-3" />
        </a>
      </div>
    </header>
  );
}
