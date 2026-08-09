import {
  Code2Icon,
  FileTextIcon,
  GlobeIcon,
  Link2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  UploadIcon,
} from "lucide-react";
import * as React from "react";
import { Link } from "react-router";
import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useAuth } from "~/hooks/use-auth";
import { Logo } from "./logo";
import { Separator } from "./ui/separator";

const data = {
  navMain: [
    {
      title: "Master Resume",
      url: "/dashboard",
      icon: <FileTextIcon className="size-4" />,
    },
    {
      title: "Import Resume",
      url: "/dashboard/import",
      icon: <UploadIcon className="size-4" />,
    },
    {
      title: "AI Resume Tailor",
      url: "/dashboard/tailor",
      icon: <SparklesIcon className="size-4" />,
    },
    {
      title: "Portfolio Builder",
      url: "/dashboard/portfolio",
      icon: <GlobeIcon className="size-4" />,
    },
    {
      title: "Custom Domains",
      url: "/dashboard/domains",
      icon: <Link2Icon className="size-4" />,
    },
  ],
  navSecondary: [
    {
      title: "GitHub Repository",
      url: "https://github.com",
      icon: <Code2Icon className="size-4" />,
    },
    {
      title: "Privacy Policy",
      url: "/privacy",
      icon: <ShieldCheckIcon className="size-4" />,
    },
    {
      title: "Terms of Service",
      url: "/terms",
      icon: <FileTextIcon className="size-4" />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();

  const currentUser = {
    name: user?.name || user?.email?.split("@")[0] || "FolioForge User",
    email: user?.email || "user@folioforge.dev",
    avatarUrl: user?.avatarUrl || null,
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/dashboard" />}>
              <Logo showText={false} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">FolioForge</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}
