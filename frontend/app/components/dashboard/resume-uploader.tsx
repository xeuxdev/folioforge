import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck2,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useResumes, type ResumeRecord } from "~/hooks/use-resumes";
import { ApiError } from "~/lib/api-client";

interface ResumeUploaderProps {
  onUploadSuccess: (resume: ResumeRecord) => void;
  isUploading?: boolean;
}

export function ResumeUploader({
  onUploadSuccess,
  isUploading = false,
}: ResumeUploaderProps) {
  const { uploadResume, isUploading: isMutationUploading } = useResumes();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loading = isUploading || isMutationUploading;

  const validateAndSelectFile = (file: File) => {
    setErrorMessage(null);

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    const isPdfOrDocx =
      allowedTypes.includes(file.type) ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".docx");

    if (!isPdfOrDocx) {
      setErrorMessage(
        "Invalid file type. Please select a PDF (.pdf) or Word (.docx) document.",
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds the 10MB limit. Please select a smaller file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (loading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || loading) return;
    setErrorMessage(null);
    try {
      const uploaded = await uploadResume({ file: selectedFile });
      onUploadSuccess(uploaded);
    } catch (err: unknown) {
      let msg = "Failed to upload document. Please check connection and try again.";
      if (err instanceof ApiError) {
        if (typeof err.data === "object" && err.data && "message" in err.data) {
          msg = String(err.data.message);
        } else if (err.statusText) {
          msg = err.statusText;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMessage(msg);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Interactive Drop Surface */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload PDF or DOCX resume document"
        onKeyDown={(e) => {
          if (!loading && (e.key === "Enter" || e.key === " ")) {
            fileInputRef.current?.click();
          }
        }}
        className={`relative group rounded-xl p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center space-y-4 border ${
          loading
            ? "opacity-60 cursor-not-allowed border-border bg-muted/20"
            : isDragOver
              ? "border-foreground bg-accent/40 cursor-pointer"
              : "border-border/80 hover:border-foreground/40 bg-card hover:bg-muted/10 cursor-pointer"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          disabled={loading}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Icon & File Visual State */}
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground transition-transform group-hover:scale-105">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-foreground" />
          ) : selectedFile ? (
            <FileCheck2 className="w-5 h-5 text-foreground" />
          ) : (
            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>

        <div className="space-y-1.5 max-w-sm">
          {selectedFile ? (
            <div>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-semibold text-foreground truncate max-w-xs">
                  {selectedFile.name}
                </p>
                {!loading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setErrorMessage(null);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Remove selected file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                {loading ? "Extracting schema fields..." : "Ready to parse"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                Drop your CV here, or{" "}
                <span className="underline underline-offset-4 decoration-border group-hover:decoration-foreground transition-colors">
                  browse files
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                PDF or DOCX documents up to 10MB
              </p>
            </>
          )}
        </div>

        {/* Format hints */}
        <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-muted-foreground/70">
          <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50">.PDF</span>
          <span className="px-2 py-0.5 rounded bg-muted/60 border border-border/50">.DOCX</span>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Primary Action Button */}
      {selectedFile && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setSelectedFile(null);
              setErrorMessage(null);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <Button
            type="button"
            disabled={loading}
            onClick={handleUploadSubmit}
            className="cursor-pointer text-xs h-9 px-4 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Parsing CV into Resume Graph...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Parse & Import Document
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
