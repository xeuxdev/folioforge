import {
  Code2,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  Zap,
  Briefcase,
  GraduationCap,
  Wrench,
  Sparkles,
  FileCode2,
} from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import type { PortfolioData } from "./minimal-template";
import { defaultPortfolioData } from "./minimal-template";

export function ExecutiveTemplate({
  data = defaultPortfolioData,
  username = "alex",
}: {
  data?: PortfolioData;
  username?: string;
}) {
  const hasExperience = data.experience && data.experience.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;
  const hasEducation = data.education && data.education.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-muted font-sans w-full max-w-full overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between gap-3 w-full">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"
              aria-hidden="true"
            ></span>
            <a
              href={`/u/${username}`}
              className="font-heading font-extrabold text-base sm:text-lg text-foreground tracking-tight truncate"
            >
              {data.fullName || "Candidate"}
            </a>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={`/u/${username}/llm.txt`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({
                variant: "outline",
                size: "xs",
                className:
                  "font-mono text-xs text-muted-foreground hover:text-foreground",
              })}
            >
              <FileCode2
                className="mr-1 w-3.5 h-3.5 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
              /llm.txt
            </a>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className={buttonVariants({
                  size: "xs",
                  className: "font-semibold text-xs",
                })}
              >
                <Mail
                  className="mr-1.5 w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
                Contact
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16 w-full">
        {/* Hero */}
        <section className="w-full space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-muted text-muted-foreground border border-border uppercase tracking-wide">
              <Zap className="w-3 h-3 shrink-0" aria-hidden="true" />
              Executive Profile
            </span>
            {data.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-muted-foreground bg-muted border border-border">
                <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                {data.location}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none">
              {data.fullName}
            </h1>
            {data.roleTitle && (
              <p className="text-base sm:text-xl font-semibold text-muted-foreground">
                {data.roleTitle}
              </p>
            )}
          </div>

          {data.bio && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {data.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {data.githubUrl && (
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "text-xs font-semibold",
                })}
              >
                <Code2
                  className="mr-1.5 w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
                GitHub
              </a>
            )}
            {data.portfolioUrl && (
              <a
                href={data.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "text-xs font-semibold",
                })}
              >
                <Globe
                  className="mr-1.5 w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
                Website
              </a>
            )}
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className={buttonVariants({
                  size: "sm",
                  className: "text-xs font-semibold",
                })}
              >
                <Mail
                  className="mr-1.5 w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
                Direct Email
              </a>
            )}
          </div>
        </section>

        {/* Featured Case Studies / Projects */}
        {hasProjects && (
          <section className="space-y-5 w-full">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Zap
                className="w-4 h-4 text-foreground shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Featured Case Studies
              </h2>
            </div>
            <div className="flex flex-col gap-5 w-full">
              {data.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border p-5 sm:p-7 rounded-2xl space-y-4 shadow-xs w-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                        {proj.title}
                      </h3>
                      {proj.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground shrink-0 p-1 mt-0.5"
                        aria-label={`View ${proj.title}`}
                      >
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  {proj.tech && proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-border/60">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-muted text-muted-foreground border border-border"
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

        {/* Work Experience */}
        {hasExperience && (
          <section className="space-y-5 w-full">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Briefcase
                className="w-4 h-4 text-foreground shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Career History
              </h2>
            </div>

            <div className="flex flex-col gap-6 w-full">
              {data.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border p-5 sm:p-7 rounded-2xl space-y-4 shadow-xs w-full"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        {exp.company}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                        {exp.role}
                      </p>
                    </div>
                    {exp.period && (
                      <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border shrink-0 self-start sm:self-auto">
                        {exp.period}
                      </span>
                    )}
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-muted-foreground space-y-2 leading-relaxed pt-1 w-full">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="wrap-break-word">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {hasSkills && (
          <section className="space-y-4 w-full">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Wrench
                className="w-4 h-4 text-foreground shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Core Competencies
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {data.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-mono font-medium text-foreground shadow-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {hasEducation && (
          <section className="space-y-4 w-full">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <GraduationCap
                className="w-4 h-4 text-foreground shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Education
              </h2>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {data.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border p-4 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm shadow-xs w-full"
                >
                  <div>
                    <h3 className="font-bold text-foreground">{edu.degree}</h3>
                    {edu.institution && (
                      <p className="text-xs text-muted-foreground">
                        {edu.institution}
                      </p>
                    )}
                  </div>
                  {edu.year && (
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                      {edu.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground space-y-2 px-4 w-full">
        <p>
          &copy; {new Date().getFullYear()} {data.fullName}. Published with
          FolioForge Engine.
        </p>
        <p className="font-mono text-[11px]">
          <a
            href={`/u/${username}/llm.txt`}
            className="hover:underline text-foreground"
          >
            View /llm.txt machine summary
          </a>
        </p>
      </footer>
    </div>
  );
}
