import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useResumes, type ResumeRecord } from "~/hooks/use-resumes";
import { ApiError } from "~/lib/api-client";

interface ResumeUploaderProps {
  onUploadSuccess: (resume: ResumeRecord) => void;
  isUploading?: boolean;
}

export function ResumeUploader({ onUploadSuccess, isUploading = false }: ResumeUploaderProps) {
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
      setErrorMessage("Invalid format. Please upload a PDF or DOCX resume document.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds 10MB size limit. Please upload a smaller file.");
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

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload PDF or DOCX resume"
        onKeyDown={(e) => {
          if (!loading && (e.key === "Enter" || e.key === " ")) {
            fileInputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center space-y-4 ${
          loading
            ? "opacity-60 cursor-not-allowed border-muted bg-muted/20"
            : isDragOver
              ? "border-primary bg-primary/5 shadow-sm cursor-pointer"
              : "border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer"
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

        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          {loading ? (
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          ) : selectedFile ? (
            <FileText className="w-7 h-7 text-primary" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </div>

        <div className="space-y-1.5 max-w-sm">
          {selectedFile ? (
            <>
              <p className="text-base font-semibold text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull;{" "}
                {loading ? "Parsing document..." : "Ready for upload & parsing"}
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-medium text-foreground">
                Drag and drop your CV here, or{" "}
                <span className="text-primary font-semibold underline underline-offset-2">
                  browse files
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF and DOCX formats up to 10MB limit
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3.5 rounded-lg border border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
              setErrorMessage(null);
            }}
          >
            Clear
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={async (e) => {
              e.stopPropagation();
              if (!selectedFile || loading) return;
              setErrorMessage(null);
              try {
                const uploaded = await uploadResume({ file: selectedFile });
                onUploadSuccess(uploaded);
              } catch (err: unknown) {
                let msg = "Upload failed. Please check backend connection and try again.";
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
            }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading & Parsing CV...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Parse CV to Resume Graph</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

