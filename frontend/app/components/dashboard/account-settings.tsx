import { useState } from "react";
import { User, ShieldCheck, Download, Trash2, Database, Key } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AccountSettings() {
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            user: "Alex Morgan",
            email: "alex@folioforge.dev",
            exportedAt: new Date().toISOString(),
            schemaVersion: "1.0",
            resumeGraph: {
              role: "Senior Full-Stack Engineer",
              company: "Xeux Labs",
              skills: ["TypeScript", "React 19", "PostgreSQL", "BullMQ"],
            },
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "folioforge-master-graph.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl w-full mx-auto">
      {/* Account Overview */}
      <div className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-xs">
        <div className="flex items-center space-x-4 border-b border-border pb-4">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shrink-0">
            AM
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Alex Morgan</h2>
            <p className="text-xs text-muted-foreground">
              Authenticated via Google OAuth 2.0 &bull; Google ID: 108927491204
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Email Address</Label>
            <Input value="alex@folioforge.dev" disabled className="mt-1 font-mono text-xs bg-muted/50" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Authentication Method</Label>
            <div className="flex items-center space-x-2 mt-1 px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs text-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Google Single Sign-On</span>
            </div>
          </div>
        </div>
      </div>

      {/* 100% Data Export & PostgreSQL Ownership */}
      <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-xs">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-foreground" />
          <h3 className="text-lg font-bold text-foreground">
            Data Portability & Database Export
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You own 100% of your career graph data. Export your complete canonical resume history, tailored job bullet variations, and portfolio preferences as a standalone JSON backup at any time.
        </p>

        <div className="pt-2 flex items-center justify-between">
          {downloadSuccess ? (
            <span className="text-xs font-semibold text-emerald-600">
              JSON File Downloaded
            </span>
          ) : (
            <span className="text-xs text-muted-foreground font-mono">Format: Zod Validated JSON</span>
          )}
          <Button onClick={handleExportJson} size="sm" className="text-xs font-semibold cursor-pointer">
            <Download className="mr-1.5 w-3.5 h-3.5" />
            Export Master Graph JSON
          </Button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-card border border-destructive/30 p-6 rounded-2xl space-y-4 shadow-xs">
        <h3 className="text-lg font-bold text-destructive">Danger Zone: Account Deletion</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Permanently delete your user profile, Google authentication credentials, canonical resume graphs, tailored bullet records, and published subdomains. This action is immediate and unrecoverable.
        </p>

        <div className="pt-2">
          <Button variant="destructive" size="sm" className="text-xs font-semibold cursor-pointer">
            <Trash2 className="mr-1.5 w-3.5 h-3.5" />
            Delete Account & Purge Data
          </Button>
        </div>
      </div>
    </div>
  );
}
