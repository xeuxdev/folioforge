import type { Route } from "./+types/settings";
import { AccountSettings } from "~/components/dashboard/account-settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Account Settings | Dashboard | FolioForge" },
    {
      name: "description",
      content: "Account details, profile photo updates, data exports, and security options.",
    },
  ];
}

export default function DashboardSettings() {
  return (
    <div className="mx-auto text-foreground space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2 pb-6 border-b border-border">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Account Preferences
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Account Settings &amp; Data Security
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal profile, avatar photo, authentication, and data portability exports.
          </p>
        </div>
      </div>

      <AccountSettings />
    </div>
  );
}
