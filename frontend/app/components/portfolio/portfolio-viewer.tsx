import type { User } from "~/hooks/use-auth";
import type { PortfolioTemplateType } from "~/types/portfolio";
import { ExecutiveTemplate } from "./executive-template";
import { MinimalTemplate, type PortfolioData } from "./minimal-template";

interface PortfolioViewerProps {
  data?: PortfolioData;
  username?: string;
  user?: User;
  template?: PortfolioTemplateType;
}

export function PortfolioViewer({
  data,
  username = "alex",
  user,
  template,
}: PortfolioViewerProps) {
  const activeTemplate = template;
  const effectiveUser: User | undefined =
    user ??
    (username
      ? {
          id: "anon",
          email: "",
          username: username,
          name: data?.fullName || username,
          avatarUrl: data?.avatarUrl || null,
        }
      : undefined);

  return (
    <div>
      {/* Render Published Theme */}
      {activeTemplate === "executive" ? (
        <ExecutiveTemplate data={data} user={effectiveUser} />
      ) : (
        <MinimalTemplate data={data} user={effectiveUser} />
      )}
    </div>
  );
}
