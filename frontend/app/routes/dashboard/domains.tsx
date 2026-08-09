import type { Route } from "./+types/domains";
import { CustomDomainManager } from "~/components/dashboard/custom-domain-manager";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Custom Domain Management | Dashboard | FolioForge" },
    {
      name: "description",
      content:
        "Bind your own domain name to your FolioForge portfolio. Configure CNAME and A records for seamless domain routing.",
    },
  ];
}

export default function DashboardDomains() {
  return (
    <div className="mx-auto space-y-6">
      <CustomDomainManager />
    </div>
  );
}
