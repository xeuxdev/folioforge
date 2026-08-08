import { MinimalTemplate, type PortfolioData, defaultPortfolioData } from "./minimal-template";
import { ExecutiveTemplate } from "./executive-template";

interface PortfolioViewerProps {
  data?: PortfolioData;
  username?: string;
  template?: "minimal" | "executive";
  /** @deprecated use template instead */
  initialTemplate?: "minimal" | "executive";
}

export function PortfolioViewer({
  data = defaultPortfolioData,
  username = "alex",
  template,
  initialTemplate = "minimal",
}: PortfolioViewerProps) {
  const activeTemplate = template ?? initialTemplate;

  return (
    <div>
      {/* Render Published Theme */}
      {activeTemplate === "executive" ? (
        <ExecutiveTemplate data={data} username={username} />
      ) : (
        <MinimalTemplate data={data} username={username} />
      )}
    </div>
  );
}
