import { useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  UserCheck,
  CheckCircle2,
  Award,
  HeartHandshake,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import type {
  CanonicalResumeGraph,
  WorkExperience,
  Education,
  Project,
  CommunityContribution,
  Certification,
  Language,
} from "~/types/resume";

interface ResumeEditorProps {
  initialGraph: CanonicalResumeGraph;
  resumeTitle: string;
  onSave: (title: string, graph: CanonicalResumeGraph) => Promise<void>;
  onDelete?: () => Promise<void>;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function ResumeEditor({
  initialGraph,
  resumeTitle,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
}: ResumeEditorProps) {
  const [title, setTitle] = useState(resumeTitle || "Master Resume");
  const [graph, setGraph] = useState<CanonicalResumeGraph>({
    contactInfo: initialGraph.contactInfo || { fullName: "Candidate" },
    summary: initialGraph.summary || "",
    workExperiences: initialGraph.workExperiences || [],
    education: initialGraph.education || [],
    skills: initialGraph.skills || [],
    projects: initialGraph.projects || [],
    communityContributions: initialGraph.communityContributions || [],
    certifications: initialGraph.certifications || [],
    languages: initialGraph.languages || [],
  });

  const [newSkillInput, setNewSkillInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ─── Contact Info Handlers ───────────────────────────────────────────────────
  const handleContactChange = (
    field: keyof CanonicalResumeGraph["contactInfo"],
    value: string,
  ) => {
    setGraph((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  // ─── Work Experience Handlers ────────────────────────────────────────────────
  const handleExperienceChange = (
    index: number,
    field: keyof WorkExperience,
    value: string | boolean,
  ) => {
    setGraph((prev) => {
      const updated = [...prev.workExperiences];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperiences: updated };
    });
  };

  const handleBulletChange = (
    expIndex: number,
    bulletIndex: number,
    text: string,
  ) => {
    setGraph((prev) => {
      const updatedExps = [...prev.workExperiences];
      const updatedBullets = [...updatedExps[expIndex].bullets];
      updatedBullets[bulletIndex] = text;
      updatedExps[expIndex] = {
        ...updatedExps[expIndex],
        bullets: updatedBullets,
      };
      return { ...prev, workExperiences: updatedExps };
    });
  };

  const addBullet = (expIndex: number) => {
    setGraph((prev) => {
      const updatedExps = [...prev.workExperiences];
      updatedExps[expIndex].bullets.push(
        "Key accomplishment or responsibility bullet point...",
      );
      return { ...prev, workExperiences: updatedExps };
    });
  };

  const deleteBullet = (expIndex: number, bulletIndex: number) => {
    setGraph((prev) => {
      const updatedExps = [...prev.workExperiences];
      updatedExps[expIndex].bullets.splice(bulletIndex, 1);
      return { ...prev, workExperiences: updatedExps };
    });
  };

  const moveBullet = (
    expIndex: number,
    bulletIndex: number,
    direction: "up" | "down",
  ) => {
    setGraph((prev) => {
      const updatedExps = [...prev.workExperiences];
      const bullets = [...updatedExps[expIndex].bullets];
      const targetIndex =
        direction === "up" ? bulletIndex - 1 : bulletIndex + 1;
      if (targetIndex < 0 || targetIndex >= bullets.length) return prev;

      const temp = bullets[bulletIndex];
      bullets[bulletIndex] = bullets[targetIndex];
      bullets[targetIndex] = temp;

      updatedExps[expIndex] = { ...updatedExps[expIndex], bullets };
      return { ...prev, workExperiences: updatedExps };
    });
  };

  const addExperience = () => {
    setGraph((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          id: String(Date.now()),
          company: "New Company",
          position: "Role / Title",
          startDate: "2023",
          endDate: "Present",
          bullets: ["Key achievement or responsibility bullet point"],
        },
      ],
    }));
  };

  const deleteExperience = (index: number) => {
    setGraph((prev) => {
      const updated = [...prev.workExperiences];
      updated.splice(index, 1);
      return { ...prev, workExperiences: updated };
    });
  };

  // ─── Education Handlers ──────────────────────────────────────────────────────
  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    setGraph((prev) => {
      const updated = [...(prev.education || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setGraph((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          id: String(Date.now()),
          institution: "University / Institution",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: "2018",
          endDate: "2022",
          location: "Location",
        },
      ],
    }));
  };

  const deleteEducation = (index: number) => {
    setGraph((prev) => {
      const updated = [...(prev.education || [])];
      updated.splice(index, 1);
      return { ...prev, education: updated };
    });
  };

  // ─── Project Handlers ────────────────────────────────────────────────────────
  const handleProjectChange = (
    index: number,
    field: keyof Project,
    value: string | string[],
  ) => {
    setGraph((prev) => {
      const updated = [...(prev.projects || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const addProject = () => {
    setGraph((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          id: String(Date.now()),
          title: "New Project",
          description: "Project overview and key technical architecture...",
          technologies: ["React", "TypeScript"],
          url: "https://example.com",
        },
      ],
    }));
  };

  const deleteProject = (index: number) => {
    setGraph((prev) => {
      const updated = [...(prev.projects || [])];
      updated.splice(index, 1);
      return { ...prev, projects: updated };
    });
  };

  // ─── Community Contribution Handlers ─────────────────────────────────────────
  const handleCommunityChange = (
    index: number,
    field: keyof CommunityContribution,
    value: string,
  ) => {
    setGraph((prev) => {
      const updated = [...(prev.communityContributions || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, communityContributions: updated };
    });
  };

  const addCommunityContribution = () => {
    setGraph((prev) => ({
      ...prev,
      communityContributions: [
        ...(prev.communityContributions || []),
        {
          id: String(Date.now()),
          organization: "Open Source / Non-Profit Org",
          role: "Volunteer Contributor",
          startDate: "2022",
          endDate: "Present",
          description:
            "Organized technical workshops and open-source contributions...",
        },
      ],
    }));
  };

  const deleteCommunityContribution = (index: number) => {
    setGraph((prev) => {
      const updated = [...(prev.communityContributions || [])];
      updated.splice(index, 1);
      return { ...prev, communityContributions: updated };
    });
  };

  // ─── Certification Handlers ──────────────────────────────────────────────────
  const handleCertificationChange = (
    index: number,
    field: keyof Certification,
    value: string,
  ) => {
    setGraph((prev) => {
      const updated = [...(prev.certifications || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  const addCertification = () => {
    setGraph((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        {
          id: String(Date.now()),
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          issueDate: "2023",
        },
      ],
    }));
  };

  const deleteCertification = (index: number) => {
    setGraph((prev) => {
      const updated = [...(prev.certifications || [])];
      updated.splice(index, 1);
      return { ...prev, certifications: updated };
    });
  };

  // ─── Language Handlers ───────────────────────────────────────────────────────
  const handleLanguageChange = (
    index: number,
    field: keyof Language,
    value: string,
  ) => {
    setGraph((prev) => {
      const updated = [...(prev.languages || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, languages: updated };
    });
  };

  const addLanguage = () => {
    setGraph((prev) => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        {
          id: String(Date.now()),
          language: "English",
          fluency: "Native / Fluent",
        },
      ],
    }));
  };

  const deleteLanguage = (index: number) => {
    setGraph((prev) => {
      const updated = [...(prev.languages || [])];
      updated.splice(index, 1);
      return { ...prev, languages: updated };
    });
  };

  // ─── Skills Handlers ─────────────────────────────────────────────────────────
  const addSkill = () => {
    if (!newSkillInput.trim()) return;
    setGraph((prev) => ({
      ...prev,
      skills: Array.from(new Set([...prev.skills, newSkillInput.trim()])),
    }));
    setNewSkillInput("");
  };

  const deleteSkill = (skillToDelete: string) => {
    setGraph((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToDelete),
    }));
  };

  // ─── Submit Handler ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSaveSuccess(false);
    await onSave(title, graph);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    await onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="w-full space-y-8 text-foreground">
      {/* Top Header & Title Editor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border shadow-xs">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Canonical Resume Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold h-10 max-w-md"
          />
        </div>

        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified & Saved
            </span>
          )}

          {onDelete && (
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer border-destructive/20"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Resume
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="cursor-pointer font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Confirm & Save Master Graph"}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal (Shadcn Dialog) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Resume from Master Graph?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{title}&quot;
              </span>
              ? The database link will be removed from your account.
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
              onClick={handleDeleteConfirm}
              className="cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Section 1: Contact Details & Summary */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
        <div className="flex items-center space-x-2 border-b border-border pb-3">
          <UserCheck className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Candidate Identity & Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Full Name
            </label>
            <Input
              value={graph.contactInfo.fullName || ""}
              onChange={(e) => handleContactChange("fullName", e.target.value)}
              placeholder="e.g. Jane Doe"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Email Address
            </label>
            <Input
              value={graph.contactInfo.email || ""}
              onChange={(e) => handleContactChange("email", e.target.value)}
              placeholder="e.g. jane@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Phone Number
            </label>
            <Input
              value={graph.contactInfo.phone || ""}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              placeholder="e.g. +1 555-0199"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Location
            </label>
            <Input
              value={graph.contactInfo.location || ""}
              onChange={(e) => handleContactChange("location", e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              LinkedIn URL
            </label>
            <Input
              value={graph.contactInfo.linkedinUrl || ""}
              onChange={(e) =>
                handleContactChange("linkedinUrl", e.target.value)
              }
              placeholder="https://linkedin.com/in/username"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              GitHub URL
            </label>
            <Input
              value={graph.contactInfo.githubUrl || ""}
              onChange={(e) => handleContactChange("githubUrl", e.target.value)}
              placeholder="https://github.com/username"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Portfolio / Website URL
            </label>
            <Input
              type="url"
              value={graph.contactInfo.websiteUrl || ""}
              onChange={(e) =>
                handleContactChange("websiteUrl", e.target.value)
              }
              placeholder="https://yourportfolio.com"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Professional Summary
          </label>
          <textarea
            value={graph.summary || ""}
            onChange={(e) =>
              setGraph((prev) => ({ ...prev, summary: e.target.value }))
            }
            rows={3}
            className="w-full mt-1 p-3 text-sm rounded-lg bg-background border border-border text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            placeholder="High-level summary of candidate experience and core value proposition..."
          />
        </div>
      </div>

      {/* Section 2: Work Experience Timeline */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Work History & Accomplishments
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addExperience}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Experience
          </Button>
        </div>

        <div className="space-y-6">
          {graph.workExperiences.map((exp, expIdx) => (
            <div
              key={exp.id || expIdx}
              className="p-5 rounded-lg bg-muted/20 border border-border space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Company
                    </label>
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        handleExperienceChange(
                          expIdx,
                          "company",
                          e.target.value,
                        )
                      }
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Position Title
                    </label>
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        handleExperienceChange(
                          expIdx,
                          "position",
                          e.target.value,
                        )
                      }
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Start Date
                    </label>
                    <Input
                      value={exp.startDate || ""}
                      onChange={(e) =>
                        handleExperienceChange(
                          expIdx,
                          "startDate",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. Jan 2021"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      End Date
                    </label>
                    <Input
                      value={exp.endDate || ""}
                      onChange={(e) =>
                        handleExperienceChange(
                          expIdx,
                          "endDate",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. Present"
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteExperience(expIdx)}
                  className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                  title="Remove Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Bullet Points List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    Bullet Points ({exp.bullets.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => addBullet(expIdx)}
                    className="text-xs text-primary hover:underline font-medium cursor-pointer"
                  >
                    + Add Bullet
                  </button>
                </div>

                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground select-none">
                      &bull;
                    </span>
                    <Input
                      value={bullet}
                      onChange={(e) =>
                        handleBulletChange(expIdx, bIdx, e.target.value)
                      }
                      className="flex-1 text-xs"
                    />
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveBullet(expIdx, bIdx, "up")}
                        disabled={bIdx === 0}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBullet(expIdx, bIdx, "down")}
                        disabled={bIdx === exp.bullets.length - 1}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBullet(expIdx, bIdx)}
                        className="p-1 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Delete Bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Education History */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Education History
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addEducation}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Education
          </Button>
        </div>

        <div className="space-y-4">
          {(graph.education || []).map((edu, eduIdx) => (
            <div
              key={edu.id || eduIdx}
              className="p-5 rounded-lg bg-muted/20 border border-border space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Institution / University
                    </label>
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        handleEducationChange(
                          eduIdx,
                          "institution",
                          e.target.value,
                        )
                      }
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Degree
                    </label>
                    <Input
                      value={edu.degree || ""}
                      onChange={(e) =>
                        handleEducationChange(eduIdx, "degree", e.target.value)
                      }
                      placeholder="e.g. Bachelor of Science"
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Field of Study
                    </label>
                    <Input
                      value={edu.fieldOfStudy || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          eduIdx,
                          "fieldOfStudy",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. Computer Science"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Start Date
                    </label>
                    <Input
                      value={edu.startDate || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          eduIdx,
                          "startDate",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. 2018"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      End Date
                    </label>
                    <Input
                      value={edu.endDate || ""}
                      onChange={(e) =>
                        handleEducationChange(eduIdx, "endDate", e.target.value)
                      }
                      placeholder="e.g. 2022"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Location
                    </label>
                    <Input
                      value={edu.location || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          eduIdx,
                          "location",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. Cambridge, MA"
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEducation(eduIdx)}
                  className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                  title="Remove Education"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Projects */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Featured Projects
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addProject}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Project
          </Button>
        </div>

        <div className="space-y-4">
          {(graph.projects || []).map((proj, projIdx) => (
            <div
              key={proj.id || projIdx}
              className="p-5 rounded-lg bg-muted/20 border border-border space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Project Title
                    </label>
                    <Input
                      value={proj.title}
                      onChange={(e) =>
                        handleProjectChange(projIdx, "title", e.target.value)
                      }
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Project URL
                    </label>
                    <Input
                      value={proj.url || ""}
                      onChange={(e) =>
                        handleProjectChange(projIdx, "url", e.target.value)
                      }
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground">
                      Description
                    </label>
                    <Input
                      value={proj.description || ""}
                      onChange={(e) =>
                        handleProjectChange(
                          projIdx,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Project details and key achievements..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteProject(projIdx)}
                  className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                  title="Remove Project"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Community Contributions & Leadership */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Community Contributions & Leadership
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addCommunityContribution}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Contribution
          </Button>
        </div>

        <div className="space-y-4">
          {(graph.communityContributions || []).map((item, itemIdx) => (
            <div
              key={item.id || itemIdx}
              className="p-5 rounded-lg bg-muted/20 border border-border space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Organization / Initiative
                    </label>
                    <Input
                      value={item.organization}
                      onChange={(e) =>
                        handleCommunityChange(
                          itemIdx,
                          "organization",
                          e.target.value,
                        )
                      }
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Role / Title
                    </label>
                    <Input
                      value={item.role}
                      onChange={(e) =>
                        handleCommunityChange(itemIdx, "role", e.target.value)
                      }
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Location / Dates
                    </label>
                    <Input
                      value={
                        item.startDate
                          ? `${item.startDate} - ${item.endDate || "Present"}`
                          : ""
                      }
                      onChange={(e) =>
                        handleCommunityChange(
                          itemIdx,
                          "startDate",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. 2022 - Present"
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-xs text-muted-foreground">
                      Description
                    </label>
                    <Input
                      value={item.description || ""}
                      onChange={(e) =>
                        handleCommunityChange(
                          itemIdx,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Volunteering, open-source work, community involvement..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCommunityContribution(itemIdx)}
                  className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                  title="Remove Contribution"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Certifications & Credentials */}
      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Certifications & Credentials
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addCertification}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Certification
          </Button>
        </div>

        <div className="space-y-4">
          {(graph.certifications || []).map((cert, certIdx) => (
            <div
              key={cert.id || certIdx}
              className="p-4 rounded-lg bg-muted/20 border border-border space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Certification Name
                    </label>
                    <Input
                      value={cert.name}
                      onChange={(e) =>
                        handleCertificationChange(
                          certIdx,
                          "name",
                          e.target.value,
                        )
                      }
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Issuing Organization
                    </label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) =>
                        handleCertificationChange(
                          certIdx,
                          "issuer",
                          e.target.value,
                        )
                      }
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Issue Date
                    </label>
                    <Input
                      value={cert.issueDate || ""}
                      onChange={(e) =>
                        handleCertificationChange(
                          certIdx,
                          "issueDate",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. 2023"
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCertification(certIdx)}
                  className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                  title="Remove Certification"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 7: Languages & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center space-x-2 border-b border-border pb-3">
            <Wrench className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Skills & Technologies
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {graph.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground border border-border"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => deleteSkill(skill)}
                  className="ml-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
                  title="Remove Skill"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 max-w-sm pt-2">
            <Input
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              placeholder="Add skill (e.g. TypeScript)..."
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSkill}
              className="cursor-pointer"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Languages
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addLanguage}
              className="cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Language
            </Button>
          </div>

          <div className="space-y-3 pt-1">
            {(graph.languages || []).map((lang, langIdx) => (
              <div
                key={lang.id || langIdx}
                className="flex items-center space-x-3"
              >
                <Input
                  value={lang.language}
                  onChange={(e) =>
                    handleLanguageChange(langIdx, "language", e.target.value)
                  }
                  placeholder="Language (e.g. Spanish)"
                  className="flex-1 text-xs"
                />
                <Input
                  value={lang.fluency || ""}
                  onChange={(e) =>
                    handleLanguageChange(langIdx, "fluency", e.target.value)
                  }
                  placeholder="Fluency (e.g. Native / Fluent)"
                  className="flex-1 text-xs"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLanguage(langIdx)}
                  className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                  title="Remove Language"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
