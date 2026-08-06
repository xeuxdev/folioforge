import {
  Code2,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  FileCode2,
  Briefcase,
  GraduationCap,
  Wrench,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "~/components/ui/button";

export interface PortfolioData {
  fullName: string;
  roleTitle: string;
  bio: string;
  email: string;
  location: string;
  githubUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    period: string;
    location: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    description: string;
    tech: string[];
    link?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export const defaultPortfolioData: PortfolioData = {
  fullName: "Alex Morgan",
  roleTitle: "Senior Full-Stack Engineer",
  bio: "Full-Stack Engineer specializing in high-throughput Node.js microservices, PostgreSQL query optimization, and type-safe React applications. Building self-hosted developer tools with zero vendor lock-in.",
  email: "alex.morgan@xeux.labs",
  location: "San Francisco, CA",
  githubUrl: "https://github.com",
  portfolioUrl: "https://alexmorgan.dev",
  linkedinUrl: "https://linkedin.com",
  skills: [
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
    "Docker",
    "Vector ATS PDF Streams",
  ],
  experience: [
    {
      company: "Xeux Labs",
      role: "Senior Full-Stack Engineer",
      period: "2023 - Present",
      location: "San Francisco, CA",
      bullets: [
        "Architected Node.js microservices and real-time document queues handling 2M+ active sessions with PostgreSQL optimization.",
        "Accelerated database query execution latency by 42% using PostgreSQL indexes and Drizzle ORM query tuning.",
        "Engineered server-side PDF generation pipeline using react-pdf renderer, cutting memory overhead by 65%.",
        "Led cross-functional engineering team of 5 developers building type-safe React Router v8 web applications.",
      ],
    },
    {
      company: "Vellum Technologies",
      role: "Full-Stack Software Engineer",
      period: "2021 - 2023",
      location: "San Jose, CA",
      bullets: [
        "Engineered high-performance React application dashboards with strict TypeScript types and Tailwind CSS v4.",
        "Integrated Redis BullMQ background queues for asynchronous document parsing tasks.",
        "Implemented RESTful Express APIs serving 500k+ monthly requests with 99.99% system availability.",
      ],
    },
  ],
  projects: [
    {
      title: "FolioForge Engine",
      description:
        "Self-hosted, type-safe CV builder and portfolio website generator powered by React Router v8, PostgreSQL, and BullMQ.",
      tech: ["TypeScript", "React 19", "PostgreSQL", "BullMQ"],
      link: "https://github.com",
    },
    {
      title: "Vector ATS Document Stream",
      description:
        "High-speed server-side PDF compiler producing single-column ATS parseable documents with zero raster fonts.",
      tech: ["Node.js", "Express", "Drizzle ORM"],
      link: "https://github.com",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "University of California, Berkeley",
      year: "2017 - 2021",
    },
  ],
};

export function MinimalTemplate({
  data = defaultPortfolioData,
  username = "alex",
}: {
  data?: PortfolioData;
  username?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-muted font-sans w-full max-w-full overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between gap-3 w-full">
          <a
            href={`/u/${username}`}
            className="font-heading font-bold text-base sm:text-lg text-foreground tracking-tight flex items-center space-x-2 truncate min-w-0"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="truncate">{data.fullName}</span>
          </a>

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
              <FileCode2 className="mr-1 w-3 h-3 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">/llm.txt</span>
              <span className="sm:hidden">llm</span>
            </a>
            <a
              href={`mailto:${data.email}`}
              className={buttonVariants({
                size: "xs",
                className: "font-semibold text-xs",
              })}
            >
              <Mail className="mr-1 w-3 h-3 sm:mr-1.5 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 w-full">
        {/* Hero Section */}
        <section className="space-y-4 sm:space-y-6 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>Available for Technical Roles</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono font-medium text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-foreground mr-1 shrink-0" />
              <span>{data.location}</span>
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3 w-full">
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight w-full break-normal">
              {data.fullName}
            </h1>
            <p className="text-lg sm:text-2xl font-semibold text-muted-foreground leading-snug w-full">
              {data.roleTitle}
            </p>
          </div>

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-3xl w-full">
            {data.bio}
          </p>

          {/* Social & Contact Links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 w-full">
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
              <Code2 className="mr-1.5 w-3.5 h-3.5 shrink-0" />
              <span>GitHub</span>
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
              <Globe className="mr-1.5 w-3.5 h-3.5 shrink-0" />
              <span>Website</span>
            </a>
            <a
              href={`mailto:${data.email}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "text-xs font-semibold truncate max-w-full",
              })}
            >
              <Mail className="mr-1.5 w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{data.email}</span>
            </a>
          </div>
        </section>

        {/* Work Experience Timeline */}
        <section className="space-y-6 w-full">
          <div className="flex items-center space-x-2 border-b border-border pb-3 w-full">
            <Briefcase className="w-5 h-5 text-foreground shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Work Experience
            </h2>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 w-full">
            {data.experience.map((exp, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-5 sm:p-8 rounded-2xl space-y-4 shadow-xs w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4 w-full">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-foreground">
                      {exp.company}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                      {exp.role}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border shrink-0 self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-muted-foreground space-y-2 leading-relaxed pt-1 w-full">
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

        {/* Featured Projects - Stacked Vertically */}
        <section className="space-y-6 w-full">
          <div className="flex items-center space-x-2 border-b border-border pb-3 w-full">
            <Sparkles className="w-5 h-5 text-foreground shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Featured Projects & Systems
            </h2>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {data.projects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-5 sm:p-8 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between transition-all hover:border-foreground/30 w-full"
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <h3 className="text-base sm:text-xl font-bold text-foreground">
                      {proj.title}
                    </h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground p-1 shrink-0"
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed w-full">
                    {proj.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60 w-full">
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

        {/* Technical Skills */}
        <section className="space-y-6 w-full">
          <div className="flex items-center space-x-2 border-b border-border pb-3 w-full">
            <Wrench className="w-5 h-5 text-foreground shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Technical Stack & Skill Taxonomy
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5 w-full">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-card border border-border text-xs font-mono font-medium text-foreground shadow-xs transition-all hover:bg-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-6 w-full">
          <div className="flex items-center space-x-2 border-b border-border pb-3 w-full">
            <GraduationCap className="w-5 h-5 text-foreground shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Education & Certification
            </h2>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {data.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm shadow-xs w-full"
              >
                <div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {edu.institution}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded border border-border self-start sm:self-auto">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12 text-center text-xs text-muted-foreground space-y-3 px-4 w-full">
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
