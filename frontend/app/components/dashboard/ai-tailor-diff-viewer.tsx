import { useState } from "react";
import { JobIngestionForm } from "./tailoring/job-ingestion-form";
import { KeywordMatchCard } from "./tailoring/keyword-match-card";
import { DiffComparisonList, type BulletDiffItem } from "./tailoring/diff-comparison-list";
import { PdfExportPreviewModal } from "./tailoring/pdf-export-preview-modal";

export function AiTailorDiffViewer() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [roleTitle, setRoleTitle] = useState<string>("Senior Full-Stack Engineer");
  const [companyName, setCompanyName] = useState<string>("Xeux Labs");

  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([
    "React",
    "Node.js",
    "PostgreSQL",
    "TypeScript",
    "BullMQ",
    "Drizzle ORM",
    "Express.js",
    "Tailwind CSS v4",
    "REST APIs",
    "Redis",
    "Docker",
    "Microservices",
    "Git",
    "CI/CD Pipelines",
    "Unit Testing",
    "System Design",
    "Scalability",
  ]);

  const [missingKeywords, setMissingKeywords] = useState<string[]>([
    "GraphQL",
    "AWS S3",
    "Kubernetes",
  ]);

  const [diffs, setDiffs] = useState<BulletDiffItem[]>([
    {
      id: "diff-1",
      company: "Xeux Labs",
      role: "Senior Full-Stack Engineer",
      originalText: "Architected Node.js microservices serving 2M+ active sessions daily.",
      tailoredText:
        "Architected high-throughput Node.js microservices and real-time document queues handling 2M+ active sessions with PostgreSQL optimization.",
      addedPhrase: "real-time document queues with PostgreSQL optimization",
      matchedKeywords: ["Node.js", "PostgreSQL", "Real-time document workflows"],
      status: "accepted",
    },
    {
      id: "diff-2",
      company: "Xeux Labs",
      role: "Senior Full-Stack Engineer",
      originalText: "Reduced candidate search latency by 42% using PostgreSQL indexes.",
      tailoredText:
        "Accelerated database query execution latency by 42% using PostgreSQL indexes and Drizzle ORM query tuning.",
      addedPhrase: "Drizzle ORM query tuning",
      matchedKeywords: ["PostgreSQL", "Query optimizations", "Drizzle ORM"],
      status: "accepted",
    },
    {
      id: "diff-3",
      company: "Vellum Technologies",
      role: "Full-Stack Software Engineer",
      originalText: "Built responsive client dashboard components using React and TypeScript.",
      tailoredText:
        "Engineered high-performance React application dashboards with strict TypeScript types and Tailwind CSS v4.",
      addedPhrase: "Tailwind CSS v4 and strict TypeScript types",
      matchedKeywords: ["React applications", "TypeScript", "Tailwind CSS v4"],
      status: "pending",
    },
  ]);

  const handleAnalyzeJob = (
    jdText: string,
    newRoleTitle: string,
    newCompanyName: string
  ) => {
    setIsProcessing(true);
    setRoleTitle(newRoleTitle || "Senior Full-Stack Engineer");
    setCompanyName(newCompanyName || "Target Company");

    setTimeout(() => {
      setIsProcessing(false);
      setHasAnalyzed(true);
    }, 2000);
  };

  const handleAddMissingSkill = (skill: string) => {
    setMatchedKeywords((prev) => [...prev, skill]);
    setMissingKeywords((prev) => prev.filter((k) => k !== skill));
  };

  return (
    <div className="space-y-8">
      {/* 1. Job Ingestion Form */}
      <JobIngestionForm
        onAnalyze={handleAnalyzeJob}
        isProcessing={isProcessing}
      />

      {/* 2. Keyword Match Card & Diff Comparison */}
      {hasAnalyzed && (
        <>
          <KeywordMatchCard
            matchedKeywords={matchedKeywords}
            missingKeywords={missingKeywords}
            onAddMissingSkill={handleAddMissingSkill}
          />

          <DiffComparisonList
            diffs={diffs}
            onUpdateDiffs={setDiffs}
            onOpenPdfPreview={() => setIsModalOpen(true)}
          />
        </>
      )}

      {/* 3. Live PDF & DOCX Export Preview Modal */}
      <PdfExportPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roleTitle={roleTitle}
        companyName={companyName}
      />
    </div>
  );
}
