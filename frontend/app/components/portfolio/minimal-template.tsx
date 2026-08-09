import { ExternalLink, FileCode2, Globe, Mail, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "./social-icons";
import type { User } from "~/hooks/use-auth";

export interface PortfolioMilestone {
  title: string;
  dates: string;
  location?: string;
  description: string;
  image?: string;
  links?: { title: string; href: string }[];
}

export interface PortfolioData {
  fullName: string;
  roleTitle: string;
  bio: string;
  email: string;
  location: string;
  avatarUrl?: string;
  phone?: string;
  githubUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  xUrl?: string;
  youtubeUrl?: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    period: string;
    location: string;
    bullets: string[];
    logoUrl?: string;
    workMode?: string;
  }[];
  projects: {
    title: string;
    description: string;
    tech: string[];
    link?: string;
    sourceUrl?: string;
    image?: string;
    video?: string;
    dates?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    logoUrl?: string;
  }[];
  milestones?: PortfolioMilestone[];
}

export function MinimalTemplate({
  data,
  user,
}: {
  data?: PortfolioData;
  user?: User;
}) {
  const hasExperience = data?.experience && data?.experience.length > 0;
  const hasProjects = data?.projects && data?.projects.length > 0;
  const hasSkills = data?.skills && data?.skills.length > 0;
  const hasEducation = data?.education && data?.education.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans w-full max-w-full overflow-x-hidden py-10 sm:py-16 px-4 sm:px-6 flex justify-center items-start selection:bg-muted">
      {/* Flat Content Container */}
      <main className="w-full max-w-2xl space-y-10 text-foreground">
        {/* ── 01. Hero Header ── */}
        <section id="hero" className="space-y-4">
          <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-sans">
                {data?.fullName}
              </h1>

              {data?.roleTitle && (
                <p className="text-xs sm:text-sm font-mono text-muted-foreground leading-relaxed font-normal">
                  {data?.roleTitle}
                </p>
              )}

              {data?.location && (
                <p className="text-xs font-mono text-muted-foreground/70">
                  {data?.location}
                </p>
              )}

              {/* Social & Contact Icon Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {data?.email && (
                  <a
                    href={`mailto:${data?.email}`}
                    aria-label="Send email"
                    className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}

                {data?.phone && (
                  <a
                    href={`tel:${data?.phone}`}
                    aria-label="Call phone"
                    className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}

                {data?.githubUrl && (
                  <a
                    href={data?.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profile"
                    className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}

                {data?.linkedinUrl && (
                  <a
                    href={data?.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}

                {data?.xUrl && (
                  <a
                    href={data?.xUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X Twitter profile"
                    className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </a>
                )}

                {data?.portfolioUrl && (
                  <a
                    href={data?.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Website"
                    className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Machine-readable llm.txt button */}
                <a
                  href={`/u/${user?.username}/llm.txt`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Machine-readable profile llm.txt"
                  className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FileCode2 className="w-3 h-3 text-emerald-600" />
                  <span>llm.txt</span>
                </a>
              </div>
            </div>

            {/* Avatar Profile Picture */}
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-border overflow-hidden bg-muted flex items-center justify-center font-bold text-xl text-foreground shadow-xs">
                {user?.avatarUrl ? (
                  <img
                    src={user?.avatarUrl}
                    alt={data?.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-mono">
                    {data?.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── 02. About Section ── */}
        {data?.bio && (
          <section id="about" className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-foreground">
              About
            </h2>
            <p className="text-xs sm:text-sm font-mono text-muted-foreground leading-relaxed">
              {data?.bio}
            </p>
          </section>
        )}

        {/* ── 03. Work Experience Section ── */}
        {hasExperience && (
          <section id="work" className="space-y-5">
            <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-foreground">
              Work Experience
            </h2>

            <div className="space-y-6">
              {data?.experience.map((exp, idx) => (
                <div key={`${exp.company}-${idx}`} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base font-sans text-foreground">
                        {exp.role}
                      </h3>
                      {(exp.workMode || exp.location) && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/60 font-normal">
                          {exp.workMode || exp.location}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono text-muted-foreground shrink-0 pt-0.5">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-muted-foreground">
                    {exp.company}
                  </p>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <div className="text-xs font-mono text-muted-foreground/90 leading-relaxed space-y-1 mt-2 pl-3 border-l border-border/60">
                      {exp.bullets.map((bullet, bIdx) => (
                        <p key={bIdx}>{bullet}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 04. Education Section ── */}
        {hasEducation && (
          <section id="education" className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-foreground">
              Education
            </h2>

            <div className="space-y-4">
              {data?.education.map((edu, idx) => (
                <div key={`${edu.institution}-${idx}`} className="space-y-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-sm sm:text-base font-sans text-foreground">
                      {edu.institution}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {edu.degree}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 05. Skills Section ── */}
        {hasSkills && (
          <section id="skills" className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-foreground">
              Skills
            </h2>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {data?.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-muted text-foreground border border-border/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── 06. Projects Section ── */}
        {hasProjects && (
          <section id="projects" className="space-y-4 pt-2">
            <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-foreground">
              Projects
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {data?.projects.map((proj, idx) => (
                <div
                  key={`${proj.title}-${idx}`}
                  className="p-4 sm:p-5 rounded-xl border border-border bg-card/40 hover:border-foreground/30 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base font-sans text-foreground flex items-center gap-2">
                      {proj.title}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${proj.title}`}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </h3>

                    {proj.dates && (
                      <span className="text-xs font-mono text-muted-foreground">
                        {proj.dates}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.tech && proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
