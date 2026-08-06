import { useState } from "react";
import {
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type DomainStatus = "unverified" | "verifying" | "active" | "error";

interface CustomDomain {
  id: string;
  domain: string;
  status: DomainStatus;
  addedAt: string;
}

const DNS_RECORDS = [
  {
    type: "CNAME",
    host: "www",
    value: "portfolio.folioforge.app",
    ttl: "3600",
    description: "Points your www subdomain to FolioForge",
  },
  {
    type: "A",
    host: "@",
    value: "76.223.64.24",
    ttl: "3600",
    description: "Maps your root domain to FolioForge servers",
  },
];

const INITIAL_DOMAINS: CustomDomain[] = [
  {
    id: "demo-1",
    domain: "alexmorgan.dev",
    status: "active",
    addedAt: "2026-07-14",
  },
];

function StatusBadge({ status }: { status: DomainStatus }) {
  const config = {
    active: {
      icon: CheckCircle2,
      label: "Active",
      className: "text-emerald-700 bg-emerald-50 border-emerald-200",
      iconClass: "text-emerald-600",
    },
    verifying: {
      icon: Clock,
      label: "Verifying DNS",
      className: "text-amber-700 bg-amber-50 border-amber-200",
      iconClass: "text-amber-600",
    },
    unverified: {
      icon: AlertTriangle,
      label: "Unverified",
      className: "text-amber-700 bg-amber-50 border-amber-200",
      iconClass: "text-amber-600",
    },
    error: {
      icon: XCircle,
      label: "DNS Error",
      className: "text-destructive bg-destructive/5 border-destructive/20",
      iconClass: "text-destructive",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <Icon className={`w-3 h-3 shrink-0 ${config.iconClass}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Copy ${value}`}
    >
      {copied ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
      ) : (
        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

export function CustomDomainManager() {
  const [domains, setDomains] = useState<CustomDomain[]>(INITIAL_DOMAINS);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const isProUser = false; // Simulated tier — swap with real auth context

  const validateDomain = (domain: string): string => {
    if (!domain.trim()) return "Please enter a domain name.";
    const domainRegex =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain.trim())) return "Enter a valid domain (e.g., alexmorgan.dev).";
    if (domains.find((d) => d.domain === domain.trim()))
      return "This domain is already added.";
    return "";
  };

  const handleAddDomain = () => {
    const error = validateDomain(inputValue);
    if (error) {
      setInputError(error);
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      const newDomain: CustomDomain = {
        id: `domain-${Date.now()}`,
        domain: inputValue.trim().toLowerCase(),
        status: "unverified",
        addedAt: new Date().toISOString().slice(0, 10),
      };
      setDomains((prev) => [...prev, newDomain]);
      setInputValue("");
      setInputError("");
      setIsAdding(false);
    }, 800);
  };

  const handleRemoveDomain = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  const handleVerify = (id: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "verifying" } : d)),
    );
    setTimeout(() => {
      setDomains((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: Math.random() > 0.3 ? "active" : "error" } : d,
        ),
      );
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-foreground shrink-0" aria-hidden="true" />
          <h2 className="text-xl font-bold text-foreground">Custom Domain Management</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Bind your own domain name to your FolioForge portfolio. Pro plan required.
        </p>
      </div>

      {/* Pro Tier Gate */}
      {!isProUser && (
        <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-foreground" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Pro Plan Required</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                Custom domain binding is available exclusively on the Pro plan. Upgrade to connect your own domain and remove the FolioForge subdomain from your public portfolio.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button size="sm" className="text-xs font-semibold cursor-pointer">
              Upgrade to Pro
            </Button>
            <Button variant="outline" size="sm" className="text-xs font-semibold cursor-pointer">
              <ExternalLink className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" />
              Compare Plans
            </Button>
          </div>
        </div>
      )}

      {/* Add Domain Input */}
      <div
        className={`bg-card border border-border p-6 rounded-2xl space-y-4 shadow-xs ${!isProUser ? "opacity-50 pointer-events-none select-none" : ""}`}
        aria-disabled={!isProUser}
      >
        <h3 className="text-base font-bold text-foreground border-b border-border pb-3">
          Add Custom Domain
        </h3>
        <div className="space-y-2">
          <Label htmlFor="domain-input" className="text-xs text-muted-foreground">
            Domain Name
          </Label>
          <div className="flex gap-2">
            <Input
              id="domain-input"
              placeholder="alexmorgan.dev"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (inputError) setInputError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
              className="font-mono text-sm"
              aria-describedby={inputError ? "domain-error" : undefined}
              aria-invalid={!!inputError}
            />
            <Button
              onClick={handleAddDomain}
              disabled={isAdding}
              size="sm"
              className="text-xs font-semibold cursor-pointer shrink-0"
            >
              {isAdding ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                "Add Domain"
              )}
            </Button>
          </div>
          {inputError && (
            <p id="domain-error" className="text-xs text-destructive font-medium" role="alert">
              {inputError}
            </p>
          )}
          <p className="text-[11px] font-mono text-muted-foreground">
            Enter the root domain without http:// or trailing slashes.
          </p>
        </div>
      </div>

      {/* Connected Domains List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          Connected Domains
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
            {domains.length}
          </span>
        </h3>

        {domains.length === 0 ? (
          <div className="bg-card border border-border p-8 rounded-2xl text-center space-y-2">
            <Globe className="w-8 h-8 text-muted-foreground mx-auto" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No custom domains added yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="bg-card border border-border p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground font-mono truncate">
                      {domain.domain}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Added {domain.addedAt}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <StatusBadge status={domain.status} />
                  {domain.status !== "active" && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleVerify(domain.id)}
                      disabled={domain.status === "verifying"}
                      className="text-xs font-semibold cursor-pointer"
                    >
                      <RefreshCw
                        className={`mr-1 w-3 h-3 ${domain.status === "verifying" ? "animate-spin" : ""}`}
                        aria-hidden="true"
                      />
                      {domain.status === "verifying" ? "Checking..." : "Verify DNS"}
                    </Button>
                  )}
                  {domain.status === "active" && (
                    <a
                      href={`https://${domain.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
                    >
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      Visit
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveDomain(domain.id)}
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                    aria-label={`Remove ${domain.domain}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DNS Configuration Instructions */}
      <div className="bg-card border border-border p-6 rounded-2xl space-y-5 shadow-xs">
        <div className="space-y-1 border-b border-border pb-4">
          <h3 className="text-base font-bold text-foreground">DNS Configuration Guide</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Add the following DNS records in your domain registrar (Cloudflare, Namecheap, Route 53, etc.) to point your domain to FolioForge servers. DNS propagation may take up to 48 hours.
          </p>
        </div>

        <div className="space-y-3">
          {DNS_RECORDS.map((record) => (
            <div
              key={record.type + record.host}
              className="bg-muted/40 border border-border rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                  {record.type}
                </span>
                <span className="text-xs text-muted-foreground">{record.description}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Host / Name</p>
                  <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-3 py-2 font-mono font-semibold text-foreground">
                    <span className="flex-1">{record.host}</span>
                    <CopyButton value={record.host} />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Value / Points To</p>
                  <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-3 py-2 font-mono font-semibold text-foreground min-w-0">
                    <span className="flex-1 truncate">{record.value}</span>
                    <CopyButton value={record.value} />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">TTL</p>
                  <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-3 py-2 font-mono font-semibold text-foreground">
                    <span className="flex-1">{record.ttl}</span>
                    <CopyButton value={record.ttl} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 bg-muted/40 border border-border rounded-xl text-xs text-muted-foreground">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
          <p className="leading-relaxed">
            DNS changes can take 24-48 hours to propagate worldwide. Click "Verify DNS" on your domain to check current propagation status. Do not remove existing records until verification succeeds.
          </p>
        </div>
      </div>

      {/* Default Subdomain Notice */}
      <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-foreground">Default Portfolio URL</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your portfolio is always accessible at the FolioForge subdomain, even when a custom domain is active.
        </p>
        <div className="flex items-center gap-2 bg-muted/50 border border-border px-4 py-2.5 rounded-xl font-mono text-sm text-foreground">
          <Globe className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <span>folioforge.app/u/alex</span>
          <a
            href="/u/alex"
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-muted-foreground hover:text-foreground"
            aria-label="Open portfolio in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
