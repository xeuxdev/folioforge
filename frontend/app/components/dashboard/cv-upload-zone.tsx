import { useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";

export function CvUploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isParsed, setIsParsed] = useState<boolean>(false);

  const handleSimulatedUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setIsParsed(false);

    // Simulate Redis BullMQ async worker parsing stream
    setTimeout(() => {
      setIsUploading(false);
      setIsParsed(true);
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(droppedFile);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl w-full mx-auto">
      {/* Overview Card */}
      <div className="bg-card border border-border p-6 rounded-2xl space-y-2 shadow-xs">
        <h2 className="text-xl font-bold text-foreground">
          Multi-Format Document Upload & Parser Pipeline
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Upload your existing CV in PDF or DOCX format. Our asynchronous Redis
          BullMQ worker queue extracts structured work history, skills, roles,
          and dates directly into your master PostgreSQL schema.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border hover:border-foreground/40 bg-card p-10 sm:p-14 rounded-2xl text-center space-y-4 transition-all"
      >
        <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto text-foreground">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">
            Drag and drop your resume file here
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PDF and DOCX format (Max file size: 10MB)
          </p>
        </div>

        <div>
          <label className="inline-flex">
            <input
              type="file"
              accept=".pdf,.docx"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            <span className="cursor-pointer inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors">
              Browse File from Computer
            </span>
          </label>
        </div>

        {file && (
          <div className="pt-4 border-t border-border flex items-center justify-between max-w-md mx-auto bg-muted/40 p-3 rounded-xl">
            <div className="flex items-center space-x-3 truncate">
              <FileText className="w-5 h-5 text-foreground shrink-0" />
              <div className="text-left truncate">
                <p className="text-xs font-semibold text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <Button
              onClick={handleSimulatedUpload}
              disabled={isUploading}
              size="sm"
              className="text-xs font-semibold cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-1.5 w-3.5 h-3.5 animate-spin" />
                  Parsing Worker...
                </>
              ) : (
                "Start Parsing Job"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Parsing Status & Extracted Output */}
      {isParsed && (
        <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-600  font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Document Parsed Successfully &bull; BullMQ Job Complete</span>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl font-mono text-xs text-foreground space-y-2 border border-border">
            <div className="text-muted-foreground border-b border-border pb-1 text-[11px] font-semibold">
              Extracted Data Graph Summary
            </div>
            <div>
              <span className="text-muted-foreground">roles_found:</span> 2
              positions
            </div>
            <div>
              <span className="text-muted-foreground">impact_bullets:</span> 5
              verified entries
            </div>
            <div>
              <span className="text-muted-foreground">skills_extracted:</span>{" "}
              10 keywords
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href="/dashboard"
              className={buttonVariants({ className: "text-xs font-semibold" })}
            >
              Review & Confirm in Master Editor
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
