import {
  Code2,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  FileCode2,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Wrench,
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
  const metrics = [
    {
      label: "Daily Active Sessions Managed",
      value: "2M+",
      highlight: "Node.js Microservices",
    },
    {
      label: "Candidate Search Latency Reduced",
      value: "42%",
      highlight: "PostgreSQL Index Tuning",
    },
    {
      label: "Server PDF Memory Overhead Cut",
      value: "65%",
      highlight: "React PDF Stream",
    },
  ];

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
              {data.fullName}
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
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-muted-foreground bg-muted border border-border">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
              {data.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-muted-foreground bg-muted border border-border">
              <Award className="w-3 h-3 shrink-0" aria-hidden="true" />
              6+ Years Senior Experience
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none">
              {data.fullName}
            </h1>
            <p className="text-base sm:text-xl font-semibold text-muted-foreground">
              {data.roleTitle}
            </p>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {data.bio}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
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
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="space-y-4 w-full">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <TrendingUp
              className="w-4 h-4 text-foreground shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Quantified Impact
            </h2>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between gap-4 shadow-xs w-full"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                    {m.label}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {m.highlight}
                  </p>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-foreground shrink-0">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Case Studies */}
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
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {proj.description}
                    </p>
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
              </div>
            ))}
          </div>
        </section>

        {/* Career Experience */}
        <section className="space-y-5 w-full">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Briefcase
              className="w-4 h-4 text-foreground shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Career Experience
            </h2>
          </div>
          <div className="flex flex-col gap-5 w-full">
            {data.experience.map((exp, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-5 sm:p-7 rounded-2xl space-y-4 shadow-xs w-full"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {exp.company}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                      {exp.role}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold bg-muted text-foreground px-3 py-1 rounded-full border border-border shrink-0">
                    {exp.period}
                  </span>
                </div>
                <ul className="list-disc pl-5 text-xs sm:text-sm text-muted-foreground space-y-2 leading-relaxed w-full">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="wrap-break-word">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section className="space-y-4 w-full">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Wrench
              className="w-4 h-4 text-foreground shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Core Technical Competencies
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 w-full">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-mono font-medium text-foreground shadow-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-4 w-full">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <GraduationCap
              className="w-4 h-4 text-foreground shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Academic Background
            </h2>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {data.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-xs"
              >
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {edu.institution}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded border border-border shrink-0">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Callout */}
        <section className="bg-foreground text-background p-7 sm:p-10 rounded-2xl sm:rounded-3xl space-y-4 shadow-md w-full">
          <div className="space-y-2">
            <h2 className="font-heading text-xl sm:text-3xl font-extrabold">
              Interested in working together?
            </h2>
            <p className="text-xs sm:text-sm text-background/70 max-w-xl leading-relaxed">
              Reach out directly for senior full-stack roles, system
              architecture consulting, or technical advisory.
            </p>
          </div>
          <a
            href={`mailto:${data.email}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "font-semibold text-xs sm:text-sm border-background/30 text-foreground hover:bg-background/10 w-full sm:w-auto justify-center",
            })}
          >
            <Mail className="mr-2 w-4 h-4 shrink-0" aria-hidden="true" />
            Get In Touch
            <ArrowRight className="ml-2 w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground space-y-2 px-4 w-full">
        <p>
          &copy; {new Date().getFullYear()} {data.fullName}. Executive Portfolio
          generated by FolioForge.
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
