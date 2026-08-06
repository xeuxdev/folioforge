import {
  FileText,
  Upload,
  Sparkles,
  Globe,
  Settings,
  LogOut,
  Link2,
} from "lucide-react";
import { Logo } from "../logo";
import { buttonVariants } from "~/components/ui/button";

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  const navItems = [
    {
      label: "Master Resume Graph",
      href: "/dashboard",
      icon: FileText,
      badge: "Source of Truth",
    },
    {
      label: "Upload & Parse CV",
      href: "/dashboard/import",
      icon: Upload,
    },
    {
      label: "AI Tailoring Engine",
      href: "/dashboard/tailor",
      icon: Sparkles,
      badge: "Diff Engine",
    },
    {
      label: "Portfolio Site",
      href: "/dashboard/portfolio",
      icon: Globe,
    },
    {
      label: "Custom Domains",
      href: "/dashboard/domains",
      icon: Link2,
      badge: "Pro",
    },
    {
      label: "Account & Data",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* Logo */}
        <div className="px-2 pt-2 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center group cursor-pointer">
            <Logo className="w-7 h-7" showText={true} />
          </a>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1" aria-label="Dashboard Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={buttonVariants({
                  variant: isActive ? "secondary" : "ghost",
                  className: `w-full justify-start space-x-3 px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`,
                })}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center shrink-0">
            AM
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">
              Alex Morgan
            </p>
            <p className="text-xs text-muted-foreground truncate">
              alex@folioforge.dev
            </p>
          </div>
        </div>

        <a
          href="/login"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "w-full justify-center text-xs cursor-pointer text-muted-foreground hover:text-foreground",
          })}
        >
          <LogOut className="mr-1.5 w-3.5 h-3.5" />
          Sign Out
        </a>
      </div>
    </aside>
  );
}
