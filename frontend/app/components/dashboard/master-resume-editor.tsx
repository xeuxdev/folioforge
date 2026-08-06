import { useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Wrench,
  User,
  ExternalLink,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export function MasterResumeEditor() {
  const [activeTab, setActiveTab] = useState<
    "experience" | "contact" | "skills" | "education"
  >("experience");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Canonical Resume Graph Initial State
  const [contactInfo, setContactInfo] = useState({
    fullName: "Alex Morgan",
    headline: "Senior Full-Stack Engineer",
    email: "alex.morgan@xeux.labs",
    location: "San Francisco, CA",
    portfolioUrl: "alexmorgan.dev",
    githubUrl: "github.com/alexmorgan",
  });

  const [workExperience, setWorkExperience] = useState<WorkExperienceItem[]>([
    {
      id: "exp-1",
      role: "Senior Full-Stack Engineer",
      company: "Xeux Labs",
      period: "2023 - Present",
      bullets: [
        "Architected Node.js microservices handling 2M+ daily active sessions with 99.99% uptime.",
        "Reduced candidate search query latency by 42% using optimized PostgreSQL indexing and Drizzle ORM.",
        "Engineered server-side PDF generation pipeline using react-pdf renderer, cutting memory overhead by 65%.",
      ],
    },
    {
      id: "exp-2",
      role: "Full-Stack Software Engineer",
      company: "Vellum Technologies",
      period: "2021 - 2023",
      bullets: [
        "Built responsive client dashboard components using React, TypeScript, and Tailwind CSS.",
        "Integrated Redis BullMQ background queues for asynchronous document parsing tasks.",
      ],
    },
  ]);

  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "React 19",
    "React Router v8",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Drizzle ORM",
    "Redis",
    "BullMQ",
    "Tailwind CSS v4",
  ]);
  const [newSkillInput, setNewSkillInput] = useState<string>("");

  const [education, setEducation] = useState<EducationItem[]>([
    {
      id: "edu-1",
      degree: "B.S. Computer Science",
      institution: "University of California, Berkeley",
      year: "2017 - 2021",
    },
  ]);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const updateBullet = (expId: string, bulletIdx: number, value: string) => {
    setWorkExperience((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          const updatedBullets = [...exp.bullets];
          updatedBullets[bulletIdx] = value;
          return { ...exp, bullets: updatedBullets };
        }
        return exp;
      }),
    );
  };

  const addBullet = (expId: string) => {
    setWorkExperience((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            bullets: [
              ...exp.bullets,
              "New achievement bullet point outlining quantifiable impact.",
            ],
          };
        }
        return exp;
      }),
    );
  };

  const removeBullet = (expId: string, bulletIdx: number) => {
    setWorkExperience((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            bullets: exp.bullets.filter((_, idx) => idx !== bulletIdx),
          };
        }
        return exp;
      }),
    );
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Status */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Canonical Graph Status
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-1">
            Master Resume Single Source of Truth
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Zod-validated schema stored in PostgreSQL. Both tailored PDFs and
            portfolio websites compile directly from this record.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {savedSuccess && (
            <span className="text-xs font-medium text-emerald-600 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved to Database</span>
            </span>
          )}
          <Button
            onClick={handleSave}
            className="font-semibold text-xs cursor-pointer"
          >
            <Save className="mr-1.5 w-4 h-4" />
            Save Master Graph
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-3 overflow-x-auto">
        <Button
          variant={activeTab === "experience" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("experience")}
          className="text-xs font-semibold"
        >
          <Briefcase className="mr-1.5 w-3.5 h-3.5" />
          Work Experience ({workExperience.length})
        </Button>
        <Button
          variant={activeTab === "contact" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("contact")}
          className="text-xs font-semibold"
        >
          <User className="mr-1.5 w-3.5 h-3.5" />
          Contact & Header
        </Button>
        <Button
          variant={activeTab === "skills" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("skills")}
          className="text-xs font-semibold"
        >
          <Wrench className="mr-1.5 w-3.5 h-3.5" />
          Skills & Stack ({skills.length})
        </Button>
        <Button
          variant={activeTab === "education" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("education")}
          className="text-xs font-semibold"
        >
          <GraduationCap className="mr-1.5 w-3.5 h-3.5" />
          Education ({education.length})
        </Button>
      </div>

      {/* Tab 1: Work Experience */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          {workExperience.map((exp) => (
            <div
              key={exp.id}
              className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-border pb-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Role Title
                  </Label>
                  <Input
                    value={exp.role}
                    onChange={(e) =>
                      setWorkExperience((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, role: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1 font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Company
                  </Label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      setWorkExperience((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, company: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Period
                  </Label>
                  <Input
                    value={exp.period}
                    onChange={(e) =>
                      setWorkExperience((prev) =>
                        prev.map((item) =>
                          item.id === exp.id
                            ? { ...item, period: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    Impact Bullets
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => addBullet(exp.id)}
                    className="text-xs"
                  >
                    <Plus className="mr-1 w-3 h-3" />
                    Add Bullet
                  </Button>
                </div>

                {exp.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="pt-2 text-xs font-mono text-muted-foreground shrink-0">
                      {idx + 1}.
                    </span>
                    <Input
                      value={bullet}
                      onChange={(e) =>
                        updateBullet(exp.id, idx, e.target.value)
                      }
                      className="flex-1 text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeBullet(exp.id, idx)}
                      className="text-destructive hover:bg-destructive/10 shrink-0 mt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Contact Info */}
      {activeTab === "contact" && (
        <div className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-xs max-w-3xl">
          <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">
            Candidate Contact & Header Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Full Name</Label>
              <Input
                value={contactInfo.fullName}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, fullName: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Professional Headline
              </Label>
              <Input
                value={contactInfo.headline}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, headline: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Email Address
              </Label>
              <Input
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Location</Label>
              <Input
                value={contactInfo.location}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, location: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Portfolio Website
              </Label>
              <Input
                value={contactInfo.portfolioUrl}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    portfolioUrl: e.target.value,
                  })
                }
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                GitHub Profile
              </Label>
              <Input
                value={contactInfo.githubUrl}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, githubUrl: e.target.value })
                }
                className="mt-1 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Skills & Stack */}
      {activeTab === "skills" && (
        <div className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-xs max-w-3xl">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-lg font-bold text-foreground">
              Technical Skills & Keyword Taxonomy
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Used for ATS keyword scoring
            </span>
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="Add skill (e.g. Docker, PostgreSQL, React 19)"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              className="text-xs"
            />
            <Button onClick={addSkill} size="sm" className="shrink-0">
              <Plus className="mr-1 w-3.5 h-3.5" />
              Add Skill
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground border border-border text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Education */}
      {activeTab === "education" && (
        <div className="space-y-6 max-w-3xl">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Degree / Certification
                  </Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((item) =>
                          item.id === edu.id
                            ? { ...item, degree: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1 font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Institution
                  </Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((item) =>
                          item.id === edu.id
                            ? { ...item, institution: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Year / Period
                  </Label>
                  <Input
                    value={edu.year}
                    onChange={(e) =>
                      setEducation((prev) =>
                        prev.map((item) =>
                          item.id === edu.id
                            ? { ...item, year: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className="mt-1 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
