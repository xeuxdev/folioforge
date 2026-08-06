import { useState } from "react";
import {
  X,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { MinimalTemplate } from "../portfolio/minimal-template";
import { ExecutiveTemplate } from "../portfolio/executive-template";

interface PortfolioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: "minimal" | "executive";
  onSelectTemplate: (template: "minimal" | "executive") => void;
}

export function PortfolioPreviewModal({
  isOpen,
  onClose,
  template,
  onSelectTemplate,
}: PortfolioPreviewModalProps) {
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl max-w-6xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header Bar */}
        <div className="p-4 sm:px-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded bg-muted text-foreground border border-border">
              {template === "minimal" ? "Template 01" : "Template 02"}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {template === "minimal"
                  ? "Clean Minimalist Theme"
                  : "Executive Editorial Theme"}
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
        <div className="flex-1 bg-muted/70 p-2 sm:p-6 overflow-y-auto flex justify-center items-start">
          <div
            className={`bg-background border border-border shadow-xl rounded-2xl overflow-x-hidden transition-all duration-300 ${
              deviceView === "mobile"
                ? "w-93.75 max-w-full min-h-175"
                : deviceView === "tablet"
                  ? "w-3xl max-w-full min-h-200"
                  : "w-full max-w-5xl min-h-212.5"
            }`}
          >
            {template === "minimal" ? (
              <MinimalTemplate username="alex" />
            ) : (
              <ExecutiveTemplate username="alex" />
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
