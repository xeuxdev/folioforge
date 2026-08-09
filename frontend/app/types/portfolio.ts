import type { CanonicalResumeGraph } from "./resume";

export type DomainVerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "failed";

export type PortfolioTemplateType = "minimal" | "executive";

export interface PortfolioPreferences {
  id: string;
  userId: string;
  selectedTemplate: PortfolioTemplateType;
  subdomain: string | null;
  llmTxtEnabled: boolean;
  selectedResumeId: string | null;
  customDomain: string | null;
  domainVerificationStatus: DomainVerificationStatus;
  domainVerificationToken: string | null;
  domainVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPortfolioPayload {
  username: string;
  name: string;
  avatarUrl: string | null;
  selectedTemplate: PortfolioTemplateType;
  llmTxtEnabled: boolean;
  customDomain: string | null;
  resumeGraph: CanonicalResumeGraph | null;
}

export interface UpdatePortfolioPreferencesPayload {
  selectedTemplate?: PortfolioTemplateType;
  subdomain?: string;
  llmTxtEnabled?: boolean;
  selectedResumeId?: string | null;
}

export interface SetCustomDomainPayload {
  customDomain: string;
}

export interface CustomDomainVerificationResult {
  success: boolean;
  domainVerificationStatus: DomainVerificationStatus;
  message: string;
  domainVerifiedAt: string | null;
}
