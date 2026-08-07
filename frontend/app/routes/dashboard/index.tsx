import { useState } from "react";
import type { Route } from "./+types/index";
import { useResumes } from "~/hooks/use-resumes";
import type { CanonicalResumeGraph } from "~/types/resume";
import { ResumeEditor } from "~/components/dashboard/resume-editor";
import {
  Upload,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  HeartHandshake,
  Award,
  Globe,
  BookOpen,
  Trophy,
  Wrench,
  ArrowRight,
  Loader2,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Master Resume Graph | Dashboard | FolioForge" },
    {
      name: "description",
      content:
        "Manage your canonical single source of truth resume graph with structured PostgreSQL fields.",
    },
  ];
}

export default function DashboardIndex() {
  const {
    resumes,
    isLoading,
    deleteResume,
    updateResume,
    isUpdating,
    isDeleting,
  } = useResumes();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const activeResume = resumes.length > 0 ? resumes[0] : null;
  const graph = activeResume?.parsedData;

  const handleSaveEditor = async (
    title: string,
    updatedGraph: CanonicalResumeGraph,
  ) => {
    if (!activeResume) return;
    await updateResume({
      id: activeResume.id,
      title,
      parsedData: updatedGraph,
    });
  };

  const handleDeleteResume = async () => {
    if (!activeResume) return;
    await deleteResume(activeResume.id);
    setIsDeleteDialogOpen(false);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm">Loading canonical resume graph...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-foreground">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Master Resume Graph
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Single source of truth for generating tailored CV exports and live
            portfolio sites.
          </p>
        </div>

        <a href="/dashboard/import">
          <Button className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" /> Upload / Update CV
          </Button>
        </a>
      </div>

      {!activeResume || !graph ? (
        /* Empty State */
        <div className="bg-card p-12 rounded-xl border border-border text-center space-y-5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">No Master Resume Found</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload your existing PDF or DOCX resume to construct your
              canonical resume graph. All tailored CV exports and portfolio
              sites are powered from this data.
            </p>
          </div>
          <a href="/dashboard/import" className="inline-block pt-2">
            <Button size="lg" className="cursor-pointer">
              Upload Resume Document <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      ) : (
        /* Master Resume Summary View */
        <div className="space-y-6">
          {/* Active Resume Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-card rounded-xl border border-border gap-4 shadow-xs">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {activeResume.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeResume.originalFilename} &bull;{" "}
                  {(activeResume.fileSize / 1024).toFixed(1)} KB &bull; Status:{" "}
                  <span className="font-medium text-emerald-600 capitalize">
                    {activeResume.parsingStatus}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="cursor-pointer font-medium"
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                {isEditing ? "View Graph Overview" : "Edit Graph"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-1.5" /> Delete
              </Button>
            </div>
          </div>

          {/* Delete Confirmation Modal (Shadcn Dialog) */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <DialogTitle>Delete Master Resume?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    &quot;{activeResume.title}&quot;
                  </span>
                  ? This will remove the master resume record from your account.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDeleteResume}
                  className="cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isEditing ? (
            <ResumeEditor
              initialGraph={
                graph || {
                  contactInfo: { fullName: "Candidate" },
                  workExperiences: [],
                  education: [],
                  skills: [],
                  projects: [],
                  communityContributions: [],
                  certifications: [],
                  languages: [],
                }
              }
              resumeTitle={activeResume.title}
              onSave={handleSaveEditor}
              onDelete={handleDeleteResume}
              isSaving={isUpdating}
              isDeleting={isDeleting}
            />
          ) : (
            <div className="space-y-6">
              {/* Candidate Overview Card */}
              <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {graph.contactInfo?.fullName || "Candidate"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {[
                        graph.contactInfo?.email,
                        graph.contactInfo?.phone,
                        graph.contactInfo?.location,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {graph.contactInfo?.websiteUrl && (
                      <a
                        href={graph.contactInfo.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Portfolio
                        / Site
                      </a>
                    )}
                    {graph.contactInfo?.linkedinUrl && (
                      <a
                        href={graph.contactInfo.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> LinkedIn
                      </a>
                    )}
                    {graph.contactInfo?.githubUrl && (
                      <a
                        href={graph.contactInfo.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> GitHub
                      </a>
                    )}
                  </div>
                </div>

                {graph.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    {graph.summary}
                  </p>
                )}
              </div>

              {/* Grid Layout: Main Details & Sidebar details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Work History */}
                  {graph.workExperiences &&
                    graph.workExperiences.length > 0 && (
                      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
                        <div className="flex items-center space-x-2 border-b border-border pb-3">
                          <Briefcase className="w-5 h-5 text-primary" />
                          <h3 className="text-base font-semibold text-foreground">
                            Work History ({graph.workExperiences.length})
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {graph.workExperiences.map((exp, idx) => (
                            <div
                              key={exp.id || idx}
                              className="space-y-2 border-l-2 border-primary/40 pl-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1">
                                <h4 className="font-semibold text-foreground">
                                  {exp.position}{" "}
                                  <span className="text-muted-foreground font-normal">
                                    at
                                  </span>{" "}
                                  {exp.company}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {[
                                    exp.startDate,
                                    exp.endDate ||
                                      (exp.isCurrent ? "Present" : ""),
                                  ]
                                    .filter(Boolean)
                                    .join(" - ")}
                                  {exp.location ? ` • ${exp.location}` : ""}
                                </span>
                              </div>

                              {exp.bullets && exp.bullets.length > 0 && (
                                <ul className="space-y-1.5 pt-1">
                                  {exp.bullets.map((bullet, bIdx) => (
                                    <li
                                      key={bIdx}
                                      className="text-xs text-muted-foreground leading-relaxed flex items-start"
                                    >
                                      <span className="mr-2 text-foreground font-bold">
                                        &bull;
                                      </span>
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Education History */}
                  {graph.education && graph.education.length > 0 && (
                    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                      <div className="flex items-center space-x-2 border-b border-border pb-3">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">
                          Education ({graph.education.length})
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {graph.education.map((edu, idx) => (
                          <div
                            key={edu.id || idx}
                            className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border/50 last:border-0 pb-3 last:pb-0 gap-1 text-sm"
                          >
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {edu.institution}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {[edu.degree, edu.fieldOfStudy]
                                  .filter(Boolean)
                                  .join(" in ")}
                                {edu.gpa ? ` • GPA: ${edu.gpa}` : ""}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {[edu.startDate, edu.endDate]
                                .filter(Boolean)
                                .join(" - ")}
                              {edu.location ? ` • ${edu.location}` : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured Projects */}
                  {graph.projects && graph.projects.length > 0 && (
                    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                      <div className="flex items-center space-x-2 border-b border-border pb-3">
                        <FolderGit2 className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">
                          Featured Projects ({graph.projects.length})
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {graph.projects.map((proj, idx) => (
                          <div
                            key={proj.id || idx}
                            className="space-y-2 text-sm border-b border-border/50 last:border-0 pb-3 last:pb-0"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-foreground flex items-center">
                                {proj.title}
                                {proj.url && (
                                  <a
                                    href={proj.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ml-2 text-primary hover:underline inline-flex items-center"
                                  >
                                    <ExternalLink className="w-3 h-3 ml-0.5" />
                                  </a>
                                )}
                              </h4>
                            </div>
                            {proj.description && (
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {proj.description}
                              </p>
                            )}
                            {proj.technologies &&
                              proj.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {proj.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Community Contributions & Leadership */}
                  {graph.communityContributions &&
                    graph.communityContributions.length > 0 && (
                      <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                        <div className="flex items-center space-x-2 border-b border-border pb-3">
                          <HeartHandshake className="w-5 h-5 text-primary" />
                          <h3 className="text-base font-semibold text-foreground">
                            Community Contributions & Leadership (
                            {graph.communityContributions.length})
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {graph.communityContributions.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="space-y-1.5 text-sm border-b border-border/50 last:border-0 pb-3 last:pb-0"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <h4 className="font-semibold text-foreground">
                                  {item.role}{" "}
                                  <span className="text-muted-foreground font-normal">
                                    at
                                  </span>{" "}
                                  {item.organization}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {[item.startDate, item.endDate || "Present"]
                                    .filter(Boolean)
                                    .join(" - ")}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Publications */}
                  {graph.publications && graph.publications.length > 0 && (
                    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                      <div className="flex items-center space-x-2 border-b border-border pb-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">
                          Publications ({graph.publications.length})
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {graph.publications.map((pub, idx) => (
                          <div
                            key={pub.id || idx}
                            className="text-sm space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-foreground">
                                {pub.title}
                              </h4>
                              {pub.publicationDate && (
                                <span className="text-xs text-muted-foreground">
                                  {pub.publicationDate}
                                </span>
                              )}
                            </div>
                            {pub.publisher && (
                              <p className="text-xs text-muted-foreground">
                                {pub.publisher}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right 1 Col: Sidebar Cards */}
                <div className="space-y-6">
                  {/* Skills */}
                  {graph.skills && graph.skills.length > 0 && (
                    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                      <div className="flex items-center space-x-2 border-b border-border pb-3">
                        <Wrench className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">
                          Skills & Technologies ({graph.skills.length})
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {graph.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground border border-border"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {graph.certifications && graph.certifications.length > 0 && (
                    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                      <div className="flex items-center space-x-2 border-b border-border pb-3">
                        <Award className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">
                          Certifications ({graph.certifications.length})
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {graph.certifications.map((cert, idx) => (
                          <div
                            key={cert.id || idx}
                            className="text-xs space-y-1 border-b border-border/40 last:border-0 pb-2.5 last:pb-0"
                          >
                            <h4 className="font-semibold text-foreground">
                              {cert.name}
                            </h4>
                            <p className="text-muted-foreground">
                              {cert.issuer}{" "}
                              {cert.issueDate ? `(${cert.issueDate})` : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {graph.languages && graph.languages.length > 0 && (
                    <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                      <div className="flex items-center space-x-2 border-b border-border pb-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">
                          Languages ({graph.languages.length})
                        </h3>
                      </div>

                      <div className="space-y-2 pt-1">
                        {graph.languages.map((lang, idx) => (
                          <div
                            key={lang.id || idx}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-foreground">
                              {lang.language}
                            </span>
                            {lang.fluency && (
                              <span className="text-muted-foreground px-2 py-0.5 rounded-md bg-muted text-[11px]">
                                {lang.fluency}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Honors & Awards */}
                  {graph.honorsAndAwards &&
                    graph.honorsAndAwards.length > 0 && (
                      <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                        <div className="flex items-center space-x-2 border-b border-border pb-3">
                          <Trophy className="w-5 h-5 text-primary" />
                          <h3 className="text-base font-semibold text-foreground">
                            Honors & Awards ({graph.honorsAndAwards.length})
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {graph.honorsAndAwards.map((award, idx) => (
                            <div
                              key={award.id || idx}
                              className="text-xs space-y-1 border-b border-border/40 last:border-0 pb-2.5 last:pb-0"
                            >
                              <h4 className="font-semibold text-foreground">
                                {award.title}
                              </h4>
                              <p className="text-muted-foreground">
                                {award.issuer}{" "}
                                {award.date ? `• ${award.date}` : ""}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
