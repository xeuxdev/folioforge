import { useState } from "react";
import { MinimalTemplate, type PortfolioData, defaultPortfolioData } from "./minimal-template";
import { ExecutiveTemplate } from "./executive-template";
import { Button } from "~/components/ui/button";
import { LayoutGrid, Sparkles } from "lucide-react";

interface PortfolioViewerProps {
  data?: PortfolioData;
  username?: string;
  initialTemplate?: "minimal" | "executive";
}

export function PortfolioViewer({
  data = defaultPortfolioData,
  username = "alex",
  initialTemplate = "minimal",
}: PortfolioViewerProps) {
  const [activeTemplate, setActiveTemplate] = useState<"minimal" | "executive">(initialTemplate);

  return (
    <div>
      {/* Floating Theme Switcher bar for testing / previewing both templates */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-card/95 backdrop-blur-md border border-border p-2 rounded-2xl shadow-xl flex items-center justify-between sm:justify-start space-x-2 text-xs max-w-md mx-auto">
        <span className="text-muted-foreground font-mono px-2 hidden md:inline">Theme Preview:</span>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
          <Button
            variant={activeTemplate === "minimal" ? "default" : "ghost"}
            size="xs"
            onClick={() => setActiveTemplate("minimal")}
            className="text-xs font-semibold flex-1 sm:flex-initial"
          >
            <LayoutGrid className="mr-1 w-3 h-3 shrink-0" />
            <span>Template 01</span>
          </Button>
          <Button
            variant={activeTemplate === "executive" ? "default" : "ghost"}
            size="xs"
            onClick={() => setActiveTemplate("executive")}
            className="text-xs font-semibold flex-1 sm:flex-initial"
          >
            <Sparkles className="mr-1 w-3 h-3 shrink-0" />
            <span>Template 02</span>
          </Button>
        </div>
      </div>

      {/* Render Active Chosen Template */}
      {activeTemplate === "minimal" ? (
        <MinimalTemplate data={data} username={username} />
      ) : (
        <ExecutiveTemplate data={data} username={username} />
      )}
    </div>
  );
}
