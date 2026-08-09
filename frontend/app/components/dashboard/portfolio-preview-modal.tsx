import {
  Check,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import type { PortfolioTemplateType } from "~/types/portfolio";
import { ExecutiveTemplate } from "../portfolio/executive-template";
import {
  MinimalTemplate,
  type PortfolioData,
} from "../portfolio/minimal-template";
import { useAuth } from "~/hooks/use-auth";

interface PortfolioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: PortfolioTemplateType;
  onSelectTemplate: (template: PortfolioTemplateType) => void;
  data?: PortfolioData;
}

export function PortfolioPreviewModal({
  isOpen,
  onClose,
  template,
  onSelectTemplate,
  data,
}: PortfolioPreviewModalProps) {
  const { user } = useAuth();
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelectTemplate(template);
    onClose();
  };

  const getTemplateTitle = () => {
    switch (template) {
      case "executive":
        return "Executive Editorial Theme";
      default:
        return "Clean Minimalist Theme";
    }
  };

  const getTemplateBadge = () => {
    switch (template) {
      case "executive":
        return "Theme 02";
      default:
        return "Theme 01";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl max-w-6xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header Bar */}
        <div className="p-4 sm:px-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded bg-muted text-foreground border border-border">
              {getTemplateBadge()}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {getTemplateTitle()}
              </h2>
              <p className="text-xs text-muted-foreground">
                Interactive preview rendering live candidate data graph.
              </p>
            </div>
          </div>

          {/* Device Viewport Toggles & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1 bg-muted p-1 rounded-xl border border-border">
              <Button
                variant={deviceView === "desktop" ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setDeviceView("desktop")}
                title="Desktop View (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant={deviceView === "tablet" ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setDeviceView("tablet")}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant={deviceView === "mobile" ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setDeviceView("mobile")}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Button
              onClick={handleSelect}
              size="sm"
              className="text-xs font-semibold"
            >
              <Check className="mr-1.5 w-3.5 h-3.5" />
              Apply Theme
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Device Canvas Container */}
        <div className="flex-1 bg-background overflow-y-auto flex justify-center items-start">
          <div
            className={`bg-background overflow-x-hidden transition-all duration-300 w-full ${
              deviceView === "mobile"
                ? "max-w-md my-4 border border-border rounded-2xl shadow-lg"
                : deviceView === "tablet"
                  ? "max-w-3xl my-4 border border-border rounded-2xl shadow-lg"
                  : "w-full"
            }`}
          >
            {template === "executive" ? (
              <ExecutiveTemplate data={data} user={user!} />
            ) : (
              <MinimalTemplate data={data} user={user!} />
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-card text-xs text-muted-foreground shrink-0">
          <span>
            Viewport Mode:{" "}
            <strong className="capitalize text-foreground">{deviceView}</strong>
          </span>
          <a
            href="/u/alex"
            target="_blank"
            rel="noreferrer"
            className="hover:underline text-foreground flex items-center"
          >
            Open full site <ExternalLink className="ml-1 w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
