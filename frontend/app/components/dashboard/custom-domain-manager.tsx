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
  Server,
  ShieldCheck,
  Loader2,
  Check,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { usePortfolioPreferences } from "~/hooks/use-portfolio";
import { useAuth } from "~/hooks/use-auth";

function StatusBadge({
  status,
}: {
  status: "unverified" | "pending" | "verified" | "failed";
}) {
  const config = {
    verified: {
      icon: ShieldCheck,
      label: "Verified & Active",
      className: "text-emerald-800 bg-emerald-50 border-emerald-200",
      iconClass: "text-emerald-600",
    },
    pending: {
      icon: Clock,
      label: "DNS Pending",
      className: "text-amber-800 bg-amber-50 border-amber-200",
      iconClass: "text-amber-600",
    },
    unverified: {
      icon: AlertTriangle,
      label: "Unverified",
      className: "text-amber-800 bg-amber-50 border-amber-200",
      iconClass: "text-amber-600",
    },
    failed: {
      icon: XCircle,
      label: "DNS Verification Failed",
      className: "text-red-800 bg-red-50 border-red-200",
      iconClass: "text-red-600",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <Icon
        className={`w-3.5 h-3.5 shrink-0 ${config.iconClass}`}
        aria-hidden="true"
      />
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
      className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      aria-label={`Copy ${value}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
      ) : (
        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

export function CustomDomainManager() {
  const { user } = useAuth();
  const {
    preferences,
    isLoading,
    setCustomDomain,
    isSettingDomain,
    verifyCustomDomain,
    isVerifyingDomain,
    removeCustomDomain,
    isRemovingDomain,
  } = usePortfolioPreferences();

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const customDomain = preferences?.customDomain ?? null;
  const status = preferences?.domainVerificationStatus ?? "unverified";
  const verificationToken = preferences?.domainVerificationToken ?? null;
  const defaultSubdomain =
    preferences?.subdomain ??
    user?.name?.toLowerCase().replace(/\s+/g, "-") ??
    "user";

  const validateDomain = (domain: string): string => {
    if (!domain.trim()) return "Please enter a domain name.";
    const clean = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");
    const domainRegex =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(clean))
      return "Enter a valid domain name (e.g. alexsmith.com or cv.alexsmith.com).";
    return "";
  };

  const handleAddDomain = async () => {
    const error = validateDomain(inputValue);
    if (error) {
      setInputError(error);
      return;
    }

    setFeedbackMessage(null);
    try {
      await setCustomDomain({ customDomain: inputValue.trim() });
      setInputValue("");
      setInputError("");
      setFeedbackMessage(
        "Custom domain saved. Please configure DNS records below and run verification.",
      );
    } catch (err: unknown) {
      const errStr =
        err instanceof Error ? err.message : "Failed to set custom domain";
      setInputError(errStr);
    }
  };

  const handleVerify = async () => {
    setFeedbackMessage(null);
    try {
      const res = await verifyCustomDomain();
      setFeedbackMessage(res.message);
    } catch (err: unknown) {
      const errStr =
        err instanceof Error ? err.message : "DNS verification failed";
      setFeedbackMessage(errStr);
    }
  };

  const handleRemoveDomain = async () => {
    setFeedbackMessage(null);
    try {
      await removeCustomDomain();
      setFeedbackMessage("Custom domain binding removed.");
    } catch (err: unknown) {
      const errStr =
        err instanceof Error ? err.message : "Failed to remove domain";
      setFeedbackMessage(errStr);
    }
  };

  const dnsRecords = [
    {
      type: "CNAME",
      host:
        customDomain?.includes(".") && customDomain.split(".").length > 2
          ? customDomain.split(".")[0]
          : "@",
      value: "cname.folioforge.com",
      ttl: "3600",
      description: "Points your domain or subdomain to FolioForge servers",
    },
    {
      type: "TXT",
      host: customDomain
        ? `_folioforge-challenge.${customDomain}`
        : "_folioforge-challenge",
      value: verificationToken || "folioforge-verify-token",
      ttl: "3600",
      description: "TXT challenge record verifying domain ownership",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full mx-auto">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground">
            <Globe className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Custom Domain Management
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bind your custom domain name to your published FolioForge
              portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Add / Update Domain Input */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-3">
          Configure Custom Domain
        </h3>
        <div className="space-y-3">
          <Label
            htmlFor="domain-input"
            className="text-xs text-muted-foreground font-medium"
          >
            Domain Name
          </Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs flex items-center">
              <Server className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
              <Input
                id="domain-input"
                placeholder="alexmorgan.dev or cv.alexmorgan.dev"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (inputError) setInputError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                className="font-mono text-xs border-0 p-0 shadow-none focus-visible:ring-0"
                aria-describedby={inputError ? "domain-error" : undefined}
                aria-invalid={!!inputError}
              />
            </div>
            <Button
              onClick={handleAddDomain}
              disabled={isSettingDomain || !inputValue.trim()}
              size="sm"
              className="text-xs font-semibold cursor-pointer shrink-0"
            >
              {isSettingDomain ? (
                <>
                  <Loader2
                    className="w-3.5 h-3.5 animate-spin mr-1.5"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                "Save Domain"
              )}
            </Button>
          </div>
          {inputError && (
            <p
              id="domain-error"
              className="text-xs text-destructive font-medium"
              role="alert"
            >
              {inputError}
            </p>
          )}
          <p className="text-[11px] font-mono text-muted-foreground">
            Enter your custom apex domain or subdomain without http:// or
            trailing slashes.
          </p>
        </div>

        {feedbackMessage && (
          <div className="p-3.5 rounded-xl border border-border bg-muted/50 text-xs font-mono text-foreground">
            {feedbackMessage}
          </div>
        )}
      </div>

      {/* Connected Domain Details Card */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          Connected Domain Status
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
            {customDomain ? 1 : 0}
          </span>
        </h3>

        {!customDomain ? (
          <div className="bg-card border border-border p-8 rounded-2xl text-center space-y-2">
            <Globe
              className="w-8 h-8 text-muted-foreground mx-auto"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-foreground">
              No custom domain configured yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Enter your domain name above to initiate DNS setup.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-3 min-w-0">
                <Globe
                  className="w-5 h-5 text-foreground shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-base font-bold text-foreground font-mono truncate">
                    {customDomain}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Target URL:{" "}
                    <code className="font-mono text-foreground font-semibold">
                      https://{customDomain}
                    </code>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <StatusBadge status={status} />
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleVerify}
                  disabled={isVerifyingDomain}
                  className="text-xs font-semibold cursor-pointer"
                >
                  {isVerifyingDomain ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 text-emerald-600" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Verify DNS
                    </>
                  )}
                </Button>
                {status === "verified" && (
                  <a
                    href={`https://${customDomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                      size: "xs",
                      className: "text-xs font-semibold",
                    })}
                  >
                    <ExternalLink
                      className="w-3.5 h-3.5 mr-1"
                      aria-hidden="true"
                    />
                    Visit
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleRemoveDomain}
                  disabled={isRemovingDomain}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  {isRemovingDomain ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                  )}
                  Remove
                </Button>
              </div>
            </div>

            {/* DNS Records Guide */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Required DNS Records for {customDomain}
              </h4>
              <div className="space-y-3">
                {dnsRecords.map((record) => (
                  <div
                    key={record.type + record.host}
                    className="bg-muted/40 border border-border rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                        {record.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {record.description}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                          Host / Name
                        </p>
                        <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-3 py-2 font-mono font-semibold text-foreground truncate">
                          <span className="flex-1 truncate">{record.host}</span>
                          <CopyButton value={record.host} />
                        </div>
                      </div>

                      <div className="space-y-1 sm:col-span-1">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                          Value / Points To
                        </p>
                        <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-3 py-2 font-mono font-semibold text-foreground min-w-0">
                          <span className="flex-1 truncate">
                            {record.value}
                          </span>
                          <CopyButton value={record.value} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                          TTL
                        </p>
                        <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-3 py-2 font-mono font-semibold text-foreground">
                          <span className="flex-1">{record.ttl}</span>
                          <CopyButton value={record.ttl} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Default Subdomain URL Info Card */}
      <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-foreground">
          Default Subdomain URL
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your portfolio remains accessible via your default FolioForge
          subdomain URL:
        </p>
        <div className="flex items-center gap-2 bg-muted/50 border border-border px-4 py-2.5 rounded-xl font-mono text-sm text-foreground">
          <Globe
            className="w-4 h-4 text-muted-foreground shrink-0"
            aria-hidden="true"
          />
          <span>https://{defaultSubdomain}.folioforge.com</span>
          <a
            href={`/u/${defaultSubdomain}`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: "ghost",
              size: "xs",
              className: "ml-auto text-xs font-semibold",
            })}
          >
            Visit Subdomain
            <ExternalLink className="ml-1 w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
