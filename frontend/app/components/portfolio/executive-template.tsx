import {
  Briefcase,
  ExternalLink,
  FileCode2,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Wrench,
  Zap,
} from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import type { User } from "~/hooks/use-auth";
import type { PortfolioData } from "./minimal-template";
import { GithubIcon, LinkedinIcon, XIcon } from "./social-icons";

export function ExecutiveTemplate({
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
    <div className="min-h-screen bg-background text-foreground selection:bg-muted font-sans w-full max-w-full overflow-x-hidden py-10 sm:py-16 px-4 sm:px-8">
      {/* Main Container */}
      <main className="max-w-4xl mx-auto space-y-12 sm:space-y-16 w-full">
        {/* ── Hero Editorial Header ── */}
        <section className="w-full space-y-6 border-b border-border/80 pb-10">
          <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold bg-muted text-foreground border border-border uppercase tracking-wider">
                  <Zap
                    className="w-3 h-3 text-foreground shrink-0"
                    aria-hidden="true"
                  />
                  Executive Editorial
                </span>
                {data?.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-mono text-muted-foreground bg-muted/60 border border-border/60">
                    <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                    {data?.location}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-none">
                  {data?.fullName}
                </h1>
                {data?.roleTitle && (
                  <p className="text-base sm:text-xl font-semibold text-muted-foreground pt-1">
                    {data?.roleTitle}
                  </p>
                )}
              </div>

              {data?.bio && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-sans">
                  {data?.bio}
                </p>
              )}

              {/* Social Action Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {data?.email && (
                  <a
                    href={`mailto:${data?.email}`}
                    className={buttonVariants({
                      size: "sm",
                      className: "text-xs font-semibold shadow-xs",
                    })}
                  >
                    <Mail
                      className="mr-1.5 w-3.5 h-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Direct Email</span>
                  </a>
                )}

                {data?.githubUrl && (
                  <a
                    href={data?.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "text-xs font-semibold",
                    })}
                  >
                    <GithubIcon className="mr-1.5 w-3.5 h-3.5 shrink-0" />
                    <span>GitHub</span>
                  </a>
                )}

                {data?.linkedinUrl && (
                  <a
                    href={data?.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "text-xs font-semibold",
                    })}
                  >
                    <LinkedinIcon className="mr-1.5 w-3.5 h-3.5 shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {data?.xUrl && (
                  <a
                    href={data?.xUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "text-xs font-semibold",
                    })}
                  >
                    <XIcon className="mr-1.5 w-3.5 h-3.5 shrink-0" />
                    <span>X (Twitter)</span>
                  </a>
                )}

                {data?.portfolioUrl && (
                  <a
                    href={data?.portfolioUrl}
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
                    <span>Website</span>
                  </a>
                )}

                <a
                  href={`/u/${user?.username}/llm.txt`}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className:
                      "font-mono text-xs text-muted-foreground hover:text-foreground",
                  })}
                >
                  <FileCode2
                    className="mr-1.5 w-3.5 h-3.5 text-emerald-600 shrink-0"
                    aria-hidden="true"
                  />
                  <span>/llm.txt</span>
                </a>
              </div>
            </div>

            {/* Avatar Image Space */}
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border border-border overflow-hidden bg-muted flex items-center justify-center font-bold text-xl text-foreground shadow-sm">
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

        {/* ── Featured Case Studies / Projects ── */}
        {hasProjects && (
          <section className="space-y-6 w-full">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Zap
                className="w-4 h-4 text-foreground shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Featured Projects &amp; Initiatives
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {data?.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/80 p-5 sm:p-6 rounded-2xl space-y-3.5 shadow-xs hover:border-foreground/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                        {proj.title}
                      </h3>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground shrink-0 p-1"
                          aria-label={`View ${proj.title}`}
                        >
                          <ExternalLink
                            className="w-4 h-4"
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </div>

                    {proj.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  {proj.tech && proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-muted text-muted-foreground border border-border/50"
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

        {/* ── Work Experience ── */}
        {hasExperience && (
          <section className="space-y-6 w-full">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Briefcase
                className="w-4 h-4 text-foreground shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Career History
              </h2>
            </div>

            <div className="flex flex-col gap-5 w-full">
              {data?.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/80 p-5 sm:p-7 rounded-2xl space-y-4 shadow-xs w-full"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3.5">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        {exp.role}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground font-mono">
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ""}
                      </p>
                    </div>

                    {exp.period && (
                      <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border shrink-0 self-start sm:self-auto">
                        {exp.period}
                      </span>
                    )}
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-muted-foreground space-y-2 leading-relaxed pt-1">
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

        {/* ── Skills & Competencies ── */}
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
              {data?.skills.map((s) => (
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

        {/* ── Education ── */}
        {hasEducation && (
          <section className="space-y-4 w-full">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <GraduationCap
                className="w-4 h-4 text-foreground shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Education &amp; Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {data?.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/80 p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-2 shadow-xs w-full"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      {edu.institution}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      {edu.degree}
                    </p>
                  </div>
                  {edu.year && (
                    <span className="text-xs font-mono text-muted-foreground/80 pt-1">
                      {edu.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="border-t border-border/80 pt-8 pb-4 text-center text-xs text-muted-foreground space-y-2 w-full">
          <p>
            &copy; {new Date().getFullYear()} {data?.fullName}. Published with
            FolioForge.
          </p>
          <p className="font-mono text-[11px]">
            <a
              href={`/u/${user?.username}/llm.txt`}
              className="hover:underline text-foreground"
            >
              View /llm.txt machine-readable profile
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
