import type { Route } from "./+types/settings";
import { AccountSettings } from "~/components/dashboard/account-settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Account Settings | Dashboard | FolioForge" },
    {
      name: "description",
      content: "Account details, data exports, and profile settings options.",
    },
  ];
}

export default function DashboardSettings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AccountSettings />
    </div>
  );
}
