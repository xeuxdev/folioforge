import type { CanonicalResumeGraph } from '../../parser/parser.service';

export type DomainVerificationStatus =
  'unverified' | 'pending' | 'verified' | 'failed';

export type PortfolioTemplateType = 'minimal' | 'executive';

export interface PortfolioPreferencesDto {
  id: string;
  userId: string;
  selectedTemplate: PortfolioTemplateType;
  subdomain: string | null;
  llmTxtEnabled: boolean;
  /** The resume ID pinned as the portfolio source. Null = auto-select latest. */
  selectedResumeId: string | null;
  /** Custom domain binding (e.g., alexsmith.com) */
  customDomain: string | null;
  domainVerificationStatus: DomainVerificationStatus;
  domainVerificationToken: string | null;
  domainVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPortfolioDto {
  username: string;
  name: string;
  avatarUrl: string | null;
  selectedTemplate: PortfolioTemplateType;
  llmTxtEnabled: boolean;
  customDomain: string | null;
  /** The canonical resume graph from the pinned (or latest) resume.
   *  Null when the user has no processed resume yet. */
  resumeGraph: CanonicalResumeGraph | null;
}

export interface UpdatePortfolioPreferencesDto {
  selectedTemplate?: PortfolioTemplateType;
  subdomain?: string;
  llmTxtEnabled?: boolean;
  /** Pass a resume ID to pin it, or null to revert to auto (latest). */
  selectedResumeId?: string | null;
}

export interface SetCustomDomainDto {
  customDomain: string;
}

export interface CustomDomainVerificationResultDto {
  success: boolean;
  domainVerificationStatus: DomainVerificationStatus;
  message: string;
  domainVerifiedAt: string | null;
}
