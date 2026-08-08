import type { CanonicalResumeGraph } from "./resume";

export interface PortfolioPreferences {
  id: string;
  userId: string;
  selectedTemplate: "minimal" | "executive";
  subdomain: string | null;
  llmTxtEnabled: boolean;
  selectedResumeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPortfolioPayload {
  username: string;
  name: string;
  avatarUrl: string | null;
  selectedTemplate: "minimal" | "executive";
  llmTxtEnabled: boolean;
  resumeGraph: CanonicalResumeGraph | null;
}

export interface UpdatePortfolioPreferencesPayload {
  selectedTemplate?: "minimal" | "executive";
  subdomain?: string;
  llmTxtEnabled?: boolean;
  selectedResumeId?: string | null;
}
