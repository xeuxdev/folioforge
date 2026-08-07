import { useState } from "react";
import {
  FileText,
  ChevronDown,
  Trash2,
  Plus,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";

export interface ResumeRecord {
  id: string;
  title: string;
  originalFilename: string;
  fileSize: number;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

interface ResumeSelectorProps {
  resumes: ResumeRecord[];
  selectedResumeId?: string | null;
  onSelectResume: (id: string) => void;
  onDeleteResume: (id: string) => Promise<void> | void;
  isDeleting?: boolean;
  onUploadClick?: () => void;
}

export function ResumeSelector({
  resumes,
  selectedResumeId,
  onSelectResume,
  onDeleteResume,
  isDeleting = false,
  onUploadClick,
}: ResumeSelectorProps) {
  const [resumeToDelete, setResumeToDelete] = useState<ResumeRecord | null>(
    null,
  );

  const activeResume =
    resumes.find((r) => r.id === selectedResumeId) || resumes[0] || null;

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;
    await onDeleteResume(resumeToDelete.id);
    setResumeToDelete(null);
  };

  if (resumes.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-xs">
      {/* Resume Dropdown Selector */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
          Active CV:
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="justify-between min-w-55 max-w-full sm:max-w-md h-auto py-2 px-3 cursor-pointer text-left"
                aria-label="Select resume CV to view"
              />
            }
          >
            <div className="flex items-center space-x-2.5 truncate">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-sm text-foreground block truncate">
                  {activeResume?.title || "Select a Resume"}
                </span>
                {activeResume && (
                  <span className="text-[11px] text-muted-foreground block truncate">
                    {activeResume.originalFilename}
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-75 sm:w-90 p-2 space-y-1"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold px-2 py-1">
                Your Resume Documents ({resumes.length})
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {resumes.map((resume) => {
              const isSelected = resume.id === activeResume?.id;
              return (
                <div
                  key={resume.id}
                  className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                    isSelected
                      ? "bg-accent/80 text-accent-foreground font-medium"
                      : "hover:bg-muted/70"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectResume(resume.id)}
                    className="flex-1 text-left flex items-start space-x-2.5 min-w-0 cursor-pointer border-none bg-transparent"
                  >
                    <FileText
                      className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {resume.title}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {resume.originalFilename} &bull;{" "}
                        {(resume.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeToDelete(resume);
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0 ml-2"
                    title="Delete CV"
                    aria-label={`Delete resume ${resume.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}

            {onUploadClick && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onUploadClick}
                  className="cursor-pointer text-primary font-medium flex items-center space-x-2 p-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Another Resume</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Action Buttons for active resume */}
      <div className="flex items-center space-x-2 shrink-0">
        {onUploadClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadClick}
            className="cursor-pointer text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Upload CV
          </Button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(resumeToDelete)}
        onOpenChange={(open) => {
          if (!open) setResumeToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Resume Document?</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{resumeToDelete?.title}&quot;
              </span>
              ? This will remove this resume record and its parsed data from
              your account.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex space-x-2 justify-end pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResumeToDelete(null)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="text-xs cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete Resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
