import * as React from "react";
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
import { Logo } from "./logo";
import {
  FileTextIcon,
  UploadIcon,
  SparklesIcon,
  GlobeIcon,
  SettingsIcon,
  Code2Icon,
  ShieldCheckIcon,
  Link2Icon,
} from "lucide-react";
import { Separator } from "./ui/separator";

const data = {
  user: {
    name: "Alex Morgan",
    email: "alex@folioforge.dev",
    avatar: "",
  },
  navMain: [
    {
      title: "Master Resume Graph",
      url: "/dashboard",
      icon: <FileTextIcon className="size-4" />,
      isActive: true,
    },
    {
      title: "Upload & Parse CV",
      url: "/dashboard/import",
      icon: <UploadIcon className="size-4" />,
    },
    {
      title: "AI Tailoring Engine",
      url: "/dashboard/tailor",
      icon: <SparklesIcon className="size-4" />,
    },
    {
      title: "Portfolio Site",
      url: "/dashboard/portfolio",
      icon: <GlobeIcon className="size-4" />,
    },
    {
      title: "Custom Domains",
      url: "/dashboard/domains",
      icon: <Link2Icon className="size-4" />,
    },
    {
      title: "Account & Data",
      url: "/dashboard/settings",
      icon: <SettingsIcon className="size-4" />,
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
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
