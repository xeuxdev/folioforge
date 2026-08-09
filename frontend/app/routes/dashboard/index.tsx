import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Check,
  ChevronDown,
  Edit3,
  ExternalLink,
  FileText,
  FolderGit2,
  Globe,
  GraduationCap,
  HeartHandshake,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Trophy,
  Upload,
  Wrench,
} from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router";
import { ResumeEditor } from "~/components/dashboard/resume-editor";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useResumes } from "~/hooks/use-resumes";
import type { CanonicalResumeGraph } from "~/types/resume";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Master Resume | Dashboard | FolioForge" },
    {
      name: "description",
      content:
        "Manage your canonical single source of truth resume with structured PostgreSQL fields.",
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
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const activeResume =
    resumes.find((r) => r.id === selectedResumeId) || resumes[0] || null;
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

  const handleSaveContactInfo = async (
    patch: Partial<import("~/types/resume").ContactInfo>,
  ) => {
    if (!activeResume || !graph) return;
    await updateResume({
      id: activeResume.id,
      title: activeResume.title,
      parsedData: {
        ...graph,
        contactInfo: { ...graph.contactInfo, ...patch },
      },
    });
  };

  const handleDeleteResume = async (idToDelete?: string) => {
    const id = idToDelete || activeResume?.id;
    if (!id) return;
    await deleteResume(id);
    if (selectedResumeId === id) {
      const remaining = resumes.filter((r) => r.id !== id);
      setSelectedResumeId(remaining.length > 0 ? remaining[0].id : null);
    }
    setIsDeleteDialogOpen(false);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground tracking-wide">
          Loading your resume graph
        </p>
      </div>
    );
  }

  if (resumes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mx-auto text-foreground">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2 pb-6 border-b border-border">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
            Master Resume
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Your canonical CV
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Single source of truth for tailored exports and portfolio sites.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {resumes.length > 1 && (
            <ResumePickerDropdown
              resumes={resumes}
              activeResume={activeResume}
              onSelectResume={(id) => {
                setSelectedResumeId(id);
                setIsEditing(false);
              }}
            />
          )}
          <Link to="/dashboard/import">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Resume
            </Button>
          </Link>
        </div>
      </div>

      {!activeResume || !graph ? (
        <EmptyState />
      ) : (
        <div className="pt-6 space-y-8">
          {/* Active resume label + actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-foreground truncate">
                {activeResume.title}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                {(activeResume.fileSize / 1024).toFixed(1)} KB
              </span>
              <span className="text-xs font-medium text-emerald-600 capitalize shrink-0">
                {activeResume.parsingStatus}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={isEditing ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="cursor-pointer text-xs h-8"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                {isEditing ? "View Overview" : "Edit"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive hover:bg-destructive/10 cursor-pointer text-xs h-8"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>

          {/* Delete Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-3">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <DialogTitle>Delete this resume?</DialogTitle>
                <DialogDescription>
                  This will permanently remove{" "}
                  <span className="font-semibold text-foreground">
                    &quot;{activeResume.title}&quot;
                  </span>{" "}
                  and all its parsed data from your account.
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
                  onClick={() => handleDeleteResume()}
                  className="cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
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
            <ResumeDocument
              graph={graph}
              onSaveContactInfo={handleSaveContactInfo}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto gap-5">
      <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground">
        <FileText className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          No resume yet
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Import your PDF or DOCX to build your canonical resume graph and
          unlock AI tailoring.
        </p>
      </div>
      <Link to="/dashboard/import">
        <Button className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Import Resume
        </Button>
      </Link>
    </div>
  );
}

interface ResumePickerDropdownProps {
  resumes: { id: string; title: string; originalFilename: string }[];
  activeResume: { id: string; title: string } | null;
  onSelectResume: (id: string) => void;
}

function ResumePickerDropdown({
  resumes,
  activeResume,
  onSelectResume,
}: ResumePickerDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer text-xs h-8 max-w-48"
            aria-label="Switch active resume"
          />
        }
      >
        <span className="truncate">
          {activeResume?.title || "Select resume"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 ml-1.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1.5">
        <DropdownMenuLabel className="text-[11px] text-muted-foreground px-2 py-1 font-semibold uppercase tracking-wider">
          Your resumes
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {resumes.map((resume) => {
          const isActive = resume.id === activeResume?.id;
          return (
            <DropdownMenuItem
              key={resume.id}
              onClick={() => onSelectResume(resume.id)}
              className="cursor-pointer flex items-center justify-between gap-2 px-2 py-2 rounded-md"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {resume.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {resume.originalFilename}
                </p>
              </div>
              {isActive && (
                <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ResumeDocumentProps {
  graph: CanonicalResumeGraph;
  onSaveContactInfo: (
    patch: Partial<import("~/types/resume").ContactInfo>,
  ) => Promise<void>;
}

function ResumeDocument({ graph, onSaveContactInfo }: ResumeDocumentProps) {
  return (
    <div className="pb-16">
      {/* Identity block */}
      <div className="pb-8 border-b border-border">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          {graph.contactInfo?.fullName || "Candidate"}
        </h2>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          <InlineEditField
            value={graph.contactInfo?.email || ""}
            placeholder="Add email"
            display={
              graph.contactInfo?.email ? (
                <span className="text-sm text-muted-foreground">
                  {graph.contactInfo.email}
                </span>
              ) : null
            }
            onSave={(v) => onSaveContactInfo({ email: v })}
          />
          <InlineEditField
            value={graph.contactInfo?.phone || ""}
            placeholder="Add phone"
            display={
              graph.contactInfo?.phone ? (
                <span className="text-sm text-muted-foreground">
                  {graph.contactInfo.phone}
                </span>
              ) : null
            }
            onSave={(v) => onSaveContactInfo({ phone: v })}
          />
          <InlineEditField
            value={graph.contactInfo?.location || ""}
            placeholder="Add location"
            display={
              graph.contactInfo?.location ? (
                <span className="text-sm text-muted-foreground">
                  {graph.contactInfo.location}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground/50 italic">
                  + location
                </span>
              )
            }
            onSave={(v) => onSaveContactInfo({ location: v })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          <InlineEditField
            value={graph.contactInfo?.websiteUrl || ""}
            placeholder="https://yourportfolio.com"
            display={
              graph.contactInfo?.websiteUrl ? (
                <a
                  href={graph.contactInfo.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-foreground hover:text-muted-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Portfolio <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-muted-foreground/50 italic">
                  + portfolio url
                </span>
              )
            }
            onSave={(v) => onSaveContactInfo({ websiteUrl: v })}
          />
          <InlineEditField
            value={graph.contactInfo?.linkedinUrl || ""}
            placeholder="https://linkedin.com/in/..."
            display={
              graph.contactInfo?.linkedinUrl ? (
                <a
                  href={graph.contactInfo.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-foreground hover:text-muted-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  LinkedIn <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-muted-foreground/50 italic">
                  + linkedin
                </span>
              )
            }
            onSave={(v) => onSaveContactInfo({ linkedinUrl: v })}
          />
          <InlineEditField
            value={graph.contactInfo?.githubUrl || ""}
            placeholder="https://github.com/..."
            display={
              graph.contactInfo?.githubUrl ? (
                <a
                  href={graph.contactInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-foreground hover:text-muted-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-muted-foreground/50 italic">
                  + github
                </span>
              )
            }
            onSave={(v) => onSaveContactInfo({ githubUrl: v })}
          />
        </div>

        {graph.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed mt-4 max-w-2xl">
            {graph.summary}
          </p>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-x-12 gap-y-10 mt-10">
        {/* Main column */}
        <div className="space-y-10 min-w-0">
          {/* Work History */}
          {graph.workExperiences && graph.workExperiences.length > 0 && (
            <section aria-labelledby="section-work">
              <SectionHeading icon={Briefcase} id="section-work">
                Work History
              </SectionHeading>
              <div className="space-y-8 mt-5">
                {graph.workExperiences.map((exp, idx) => (
                  <WorkEntry key={exp.id || idx} exp={exp} />
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {graph.education && graph.education.length > 0 && (
            <section aria-labelledby="section-edu">
              <SectionHeading icon={GraduationCap} id="section-edu">
                Education
              </SectionHeading>
              <div className="space-y-5 mt-5">
                {graph.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {edu.institution}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {[edu.degree, edu.fieldOfStudy]
                          .filter(Boolean)
                          .join(" in ")}
                        {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                      {edu.location ? ` · ${edu.location}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {graph.projects && graph.projects.length > 0 && (
            <section aria-labelledby="section-projects">
              <SectionHeading icon={FolderGit2} id="section-projects">
                Projects
              </SectionHeading>
              <div className="space-y-5 mt-5">
                {graph.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {proj.title}
                      </h4>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`View ${proj.title}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {proj.technologies.join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Community Contributions */}
          {graph.communityContributions &&
            graph.communityContributions.length > 0 && (
              <section aria-labelledby="section-community">
                <SectionHeading icon={HeartHandshake} id="section-community">
                  Community
                </SectionHeading>
                <div className="space-y-5 mt-5">
                  {graph.communityContributions.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {item.role}{" "}
                          <span className="font-normal text-muted-foreground">
                            at
                          </span>{" "}
                          {item.organization}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {[item.startDate, item.endDate || "Present"]
                          .filter(Boolean)
                          .join(" – ")}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Publications */}
          {graph.publications && graph.publications.length > 0 && (
            <section aria-labelledby="section-pubs">
              <SectionHeading icon={BookOpen} id="section-pubs">
                Publications
              </SectionHeading>
              <div className="space-y-4 mt-5">
                {graph.publications.map((pub, idx) => (
                  <div
                    key={pub.id || idx}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {pub.title}
                      </h4>
                      {pub.publisher && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {pub.publisher}
                        </p>
                      )}
                    </div>
                    {pub.publicationDate && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {pub.publicationDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar column */}
        <div className="space-y-8 lg:pt-0 pt-4 lg:border-t-0 border-t border-border">
          {/* Skills */}
          {graph.skills && graph.skills.length > 0 && (
            <section aria-labelledby="section-skills">
              <SidebarSectionHeading icon={Wrench} id="section-skills">
                Skills
              </SidebarSectionHeading>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {graph.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs text-foreground bg-muted px-2 py-0.5 rounded font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {graph.certifications && graph.certifications.length > 0 && (
            <section aria-labelledby="section-certs">
              <SidebarSectionHeading icon={Award} id="section-certs">
                Certifications
              </SidebarSectionHeading>
              <div className="mt-3 space-y-3">
                {graph.certifications.map((cert, idx) => (
                  <div key={cert.id || idx}>
                    <p className="text-xs font-semibold text-foreground">
                      {cert.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cert.issuer}
                      {cert.issueDate ? ` · ${cert.issueDate}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {graph.languages && graph.languages.length > 0 && (
            <section aria-labelledby="section-langs">
              <SidebarSectionHeading icon={Globe} id="section-langs">
                Languages
              </SidebarSectionHeading>
              <div className="mt-3 space-y-2">
                {graph.languages.map((lang, idx) => (
                  <div
                    key={lang.id || idx}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-foreground">
                      {lang.language}
                    </span>
                    {lang.fluency && (
                      <span className="text-xs text-muted-foreground">
                        {lang.fluency}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Honors & Awards */}
          {graph.honorsAndAwards && graph.honorsAndAwards.length > 0 && (
            <section aria-labelledby="section-awards">
              <SidebarSectionHeading icon={Trophy} id="section-awards">
                Honors
              </SidebarSectionHeading>
              <div className="mt-3 space-y-3">
                {graph.honorsAndAwards.map((award, idx) => (
                  <div key={award.id || idx}>
                    <p className="text-xs font-semibold text-foreground">
                      {award.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {award.issuer}
                      {award.date ? ` · ${award.date}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* Section heading helpers */
interface SectionHeadingProps {
  icon: React.ComponentType<{ className?: string }>;
  id: string;
  children: React.ReactNode;
}

function SectionHeading({ icon: Icon, id, children }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-border">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <h3
        id={id}
        className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {children}
      </h3>
    </div>
  );
}

function SidebarSectionHeading({
  icon: Icon,
  id,
  children,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-1.5 pb-2 border-b border-border">
      <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
      <h3
        id={id}
        className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {children}
      </h3>
    </div>
  );
}

/* Work entry — clean two-column date layout, no left border */
interface WorkEntryProps {
  exp: {
    id?: string;
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    location?: string;
    bullets: string[];
  };
}

function WorkEntry({ exp }: WorkEntryProps) {
  const dateRange = [
    exp.startDate,
    exp.endDate || (exp.isCurrent ? "Present" : ""),
  ]
    .filter(Boolean)
    .join(" – ");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-6 gap-y-1">
      {/* Date column */}
      <div className="sm:text-right pt-0.5">
        <p className="text-xs text-muted-foreground leading-snug">
          {dateRange}
        </p>
        {exp.location && (
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            {exp.location}
          </p>
        )}
      </div>

      {/* Content column */}
      <div className="space-y-2">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            {exp.position}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">{exp.company}</p>
        </div>

        {exp.bullets && exp.bullets.length > 0 && (
          <ul className="space-y-1.5" role="list">
            {exp.bullets.map((bullet, bIdx) => (
              <li
                key={bIdx}
                className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2"
              >
                <span
                  className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  InlineEditField — click to edit, blur/Enter to save                */
/* ------------------------------------------------------------------ */

interface InlineEditFieldProps {
  value: string;
  placeholder: string;
  display: React.ReactNode;
  onSave: (value: string) => Promise<void>;
}

function InlineEditField({
  value,
  placeholder,
  display,
  onSave,
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    setDraft(value);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commit = async () => {
    if (draft.trim() === value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(draft.trim());
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void commit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => void commit()}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isSaving}
        aria-label={placeholder}
        className="text-xs border-b border-border bg-transparent text-foreground focus:outline-none focus:border-foreground min-w-32 max-w-64 py-0.5 disabled:opacity-50"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className="group inline-flex items-center gap-1 cursor-pointer"
      aria-label={`Edit ${placeholder}`}
    >
      {display}
      <Pencil
        className="w-2.5 h-2.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors shrink-0"
        aria-hidden="true"
      />
    </button>
  );
}
