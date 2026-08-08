import type { CanonicalResumeGraph } from '../../parser/parser.service';

export interface PortfolioPreferencesDto {
  id: string;
  userId: string;
  selectedTemplate: 'minimal' | 'executive';
  subdomain: string | null;
  llmTxtEnabled: boolean;
  /** The resume ID pinned as the portfolio source. Null = auto-select latest. */
  selectedResumeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPortfolioDto {
  username: string;
  name: string;
  avatarUrl: string | null;
  selectedTemplate: 'minimal' | 'executive';
  llmTxtEnabled: boolean;
  /** The canonical resume graph from the pinned (or latest) resume.
   *  Null when the user has no processed resume yet. */
  resumeGraph: CanonicalResumeGraph | null;
}

export interface UpdatePortfolioPreferencesDto {
  selectedTemplate?: 'minimal' | 'executive';
  subdomain?: string;
  llmTxtEnabled?: boolean;
  /** Pass a resume ID to pin it, or null to revert to auto (latest). */
  selectedResumeId?: string | null;
}
