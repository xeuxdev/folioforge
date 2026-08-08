import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { InferSelectModel } from 'drizzle-orm';
import { promises as dns } from 'dns';
import { randomBytes } from 'crypto';
import { DRIZZLE_TOKEN } from '../database/database.module';
import { portfolios, resumes, users } from '../database/schema';
import * as schema from '../database/schema';
import type { CanonicalResumeGraph } from '../parser/parser.service';
import type {
  PortfolioPreferencesDto,
  PublicPortfolioDto,
  UpdatePortfolioPreferencesDto,
  DomainVerificationStatus,
  CustomDomainVerificationResultDto,
} from './dto/portfolio.dto';

type PortfolioRecord = InferSelectModel<typeof portfolios>;

const TEMPLATE_VALUES = ['minimal', 'executive'] as const;
type Template = (typeof TEMPLATE_VALUES)[number];

function isTemplate(value: string): value is Template {
  return (TEMPLATE_VALUES as readonly string[]).includes(value);
}

function sanitizeDomain(domain: string): string {
  const clean = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');

  const domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

  if (!domainRegex.test(clean)) {
    throw new BadRequestException('Invalid custom domain format');
  }

  return clean;
}

@Injectable()
export class PortfolioService {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  // ─── Internal helpers ──────────────────────────────────────────────────────

  private toPreferencesDto(record: PortfolioRecord): PortfolioPreferencesDto {
    const template = isTemplate(record.selectedTemplate)
      ? record.selectedTemplate
      : 'minimal';

    const status: DomainVerificationStatus =
      (record.domainVerificationStatus as DomainVerificationStatus) ||
      'unverified';

    return {
      id: record.id,
      userId: record.userId,
      selectedTemplate: template,
      subdomain: record.subdomain,
      llmTxtEnabled: record.llmTxtEnabled,
      selectedResumeId: record.selectedResumeId ?? null,
      customDomain: record.customDomain ?? null,
      domainVerificationStatus: status,
      domainVerificationToken: record.domainVerificationToken ?? null,
      domainVerifiedAt: record.domainVerifiedAt
        ? record.domainVerifiedAt.toISOString()
        : null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  /**
   * Returns the user's portfolio preferences row, creating a default one if
   * it does not yet exist.
   */
  async getOrCreatePreferences(
    userId: string,
  ): Promise<PortfolioPreferencesDto> {
    const existing = await this.db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .limit(1);

    if (existing[0]) {
      return this.toPreferencesDto(existing[0]);
    }

    // Seed default preferences — subdomain defaults to the user's username
    const userRow = await this.db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const defaultSubdomain = userRow[0]?.username ?? null;

    const [created] = await this.db
      .insert(portfolios)
      .values({
        userId,
        selectedTemplate: 'minimal',
        subdomain: defaultSubdomain,
        llmTxtEnabled: true,
        selectedResumeId: null,
      })
      .returning();

    return this.toPreferencesDto(created);
  }

  /**
   * Saves the user's template, subdomain, llmTxtEnabled, and selectedResumeId.
   */
  async updatePreferences(
    userId: string,
    dto: UpdatePortfolioPreferencesDto,
  ): Promise<PortfolioPreferencesDto> {
    await this.getOrCreatePreferences(userId);

    if (dto.selectedTemplate && !isTemplate(dto.selectedTemplate)) {
      throw new BadRequestException(
        `selectedTemplate must be one of: ${TEMPLATE_VALUES.join(', ')}`,
      );
    }

    if (dto.subdomain !== undefined) {
      const clean = dto.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (clean.length < 2) {
        throw new BadRequestException(
          'subdomain must be at least 2 alphanumeric characters',
        );
      }
      dto.subdomain = clean;
    }

    if (dto.selectedResumeId) {
      const resumeCheck = await this.db
        .select({ id: resumes.id })
        .from(resumes)
        .where(
          and(eq(resumes.id, dto.selectedResumeId), eq(resumes.userId, userId)),
        )
        .limit(1);

      if (!resumeCheck[0]) {
        throw new BadRequestException(
          'selectedResumeId does not belong to this user',
        );
      }
    }

    const [updated] = await this.db
      .update(portfolios)
      .set({
        ...(dto.selectedTemplate
          ? { selectedTemplate: dto.selectedTemplate }
          : {}),
        ...(dto.subdomain !== undefined ? { subdomain: dto.subdomain } : {}),
        ...(dto.llmTxtEnabled !== undefined
          ? { llmTxtEnabled: dto.llmTxtEnabled }
          : {}),
        ...(dto.selectedResumeId !== undefined
          ? { selectedResumeId: dto.selectedResumeId }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(portfolios.userId, userId))
      .returning();

    return this.toPreferencesDto(updated);
  }

  // ─── Custom Domain Management ──────────────────────────────────────────────

  /**
   * Binds a custom domain to the user's portfolio and generates a verification token.
   */
  async setCustomDomain(
    userId: string,
    rawDomain: string,
  ): Promise<PortfolioPreferencesDto> {
    await this.getOrCreatePreferences(userId);
    const domain = sanitizeDomain(rawDomain);

    // Check if domain is already claimed by another portfolio
    const existing = await this.db
      .select({ id: portfolios.id, userId: portfolios.userId })
      .from(portfolios)
      .where(eq(portfolios.customDomain, domain))
      .limit(1);

    if (existing[0] && existing[0].userId !== userId) {
      throw new ConflictException(
        'Custom domain is already claimed by another portfolio',
      );
    }

    const token = `folioforge-verify-${randomBytes(12).toString('hex')}`;

    const [updated] = await this.db
      .update(portfolios)
      .set({
        customDomain: domain,
        domainVerificationStatus: 'pending',
        domainVerificationToken: token,
        domainVerifiedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(portfolios.userId, userId))
      .returning();

    return this.toPreferencesDto(updated);
  }

  /**
   * Performs automated DNS verification for CNAME or TXT challenge records.
   */
  async verifyCustomDomain(
    userId: string,
  ): Promise<CustomDomainVerificationResultDto> {
    const prefs = await this.getOrCreatePreferences(userId);

    if (!prefs.customDomain || !prefs.domainVerificationToken) {
      throw new BadRequestException('No custom domain configured to verify');
    }

    const domain = prefs.customDomain;
    const token = prefs.domainVerificationToken;
    let verified = false;
    let message = '';

    try {
      // 1. Check CNAME resolution
      try {
        const cnames = await dns.resolveCname(domain);
        if (
          cnames.some(
            (c) =>
              c.includes('folioforge') ||
              (prefs.subdomain && c.includes(prefs.subdomain)),
          )
        ) {
          verified = true;
          message = `Successfully verified CNAME record pointing to ${cnames[0]}`;
        }
      } catch {
        // CNAME lookup failed or not set, fall through to TXT check
      }

      // 2. Check TXT record verification challenge: _folioforge-challenge.<domain> or <domain>
      if (!verified) {
        const txtDomains = [domain, `_folioforge-challenge.${domain}`];

        for (const targetDomain of txtDomains) {
          try {
            const txtRecords = await dns.resolveTxt(targetDomain);
            const flatRecords = txtRecords.flat();
            if (flatRecords.some((rec) => rec.includes(token))) {
              verified = true;
              message = `Successfully verified DNS TXT verification token on ${targetDomain}`;
              break;
            }
          } catch {
            // TXT query failed for targetDomain
          }
        }
      }

      if (!verified) {
        message = `DNS verification pending. Please ensure either a CNAME pointing to folioforge.com or a TXT record containing "${token}" is configured for ${domain}`;
      }
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : String(err);
      message = `DNS lookup failed: ${errStr}`;
    }

    const now = new Date();
    const status: DomainVerificationStatus = verified ? 'verified' : 'failed';

    const [updated] = await this.db
      .update(portfolios)
      .set({
        domainVerificationStatus: status,
        ...(verified ? { domainVerifiedAt: now } : {}),
        updatedAt: now,
      })
      .where(eq(portfolios.userId, userId))
      .returning();

    return {
      success: verified,
      domainVerificationStatus: status,
      message,
      domainVerifiedAt: updated.domainVerifiedAt
        ? updated.domainVerifiedAt.toISOString()
        : null,
    };
  }

  /**
   * Removes custom domain binding from user portfolio.
   */
  async removeCustomDomain(userId: string): Promise<PortfolioPreferencesDto> {
    await this.getOrCreatePreferences(userId);

    const [updated] = await this.db
      .update(portfolios)
      .set({
        customDomain: null,
        domainVerificationStatus: 'unverified',
        domainVerificationToken: null,
        domainVerifiedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(portfolios.userId, userId))
      .returning();

    return this.toPreferencesDto(updated);
  }

  /**
   * Resolves a public portfolio by custom domain hostname.
   */
  async getPublicPortfolioByCustomDomain(
    rawDomain: string,
  ): Promise<PublicPortfolioDto> {
    const domain = sanitizeDomain(rawDomain);

    const portfolioRows = await this.db
      .select()
      .from(portfolios)
      .where(eq(portfolios.customDomain, domain))
      .limit(1);

    if (!portfolioRows[0]) {
      throw new NotFoundException(
        `Portfolio not found for custom domain: ${domain}`,
      );
    }

    const portfolioRec = portfolioRows[0];

    const userRows = await this.db
      .select()
      .from(users)
      .where(eq(users.id, portfolioRec.userId))
      .limit(1);

    if (!userRows[0]) {
      throw new NotFoundException('User not found');
    }

    const user = userRows[0];

    // Fetch resume
    let resumeGraph: CanonicalResumeGraph | null = null;
    if (portfolioRec.selectedResumeId) {
      const pinnedRows = await this.db
        .select({ parsedData: resumes.parsedData })
        .from(resumes)
        .where(
          and(
            eq(resumes.id, portfolioRec.selectedResumeId),
            eq(resumes.userId, user.id),
          ),
        )
        .limit(1);
      resumeGraph =
        (pinnedRows[0]?.parsedData as CanonicalResumeGraph | null) ?? null;
    } else {
      const latestRows = await this.db
        .select({ parsedData: resumes.parsedData })
        .from(resumes)
        .where(eq(resumes.userId, user.id))
        .orderBy(desc(resumes.updatedAt))
        .limit(1);
      resumeGraph =
        (latestRows[0]?.parsedData as CanonicalResumeGraph | null) ?? null;
    }

    const prefs = this.toPreferencesDto(portfolioRec);

    return {
      username: user.username ?? 'user',
      name: user.name,
      avatarUrl: user.avatarUrl ?? null,
      selectedTemplate: prefs.selectedTemplate,
      llmTxtEnabled: prefs.llmTxtEnabled,
      customDomain: prefs.customDomain,
      resumeGraph,
    };
  }

  /**
   * Resolves a public portfolio by username slug.
   */
  async getPublicPortfolio(username: string): Promise<PublicPortfolioDto> {
    const userRows = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!userRows[0]) {
      throw new NotFoundException(
        `Portfolio not found for username: ${username}`,
      );
    }

    const user = userRows[0];
    const prefs = await this.getOrCreatePreferences(user.id);

    let resumeGraph: CanonicalResumeGraph | null = null;
    if (prefs.selectedResumeId) {
      const pinnedRows = await this.db
        .select({ parsedData: resumes.parsedData })
        .from(resumes)
        .where(
          and(
            eq(resumes.id, prefs.selectedResumeId),
            eq(resumes.userId, user.id),
          ),
        )
        .limit(1);
      resumeGraph =
        (pinnedRows[0]?.parsedData as CanonicalResumeGraph | null) ?? null;
    } else {
      const latestRows = await this.db
        .select({ parsedData: resumes.parsedData })
        .from(resumes)
        .where(eq(resumes.userId, user.id))
        .orderBy(desc(resumes.updatedAt))
        .limit(1);
      resumeGraph =
        (latestRows[0]?.parsedData as CanonicalResumeGraph | null) ?? null;
    }

    return {
      username: user.username ?? username,
      name: user.name,
      avatarUrl: user.avatarUrl ?? null,
      selectedTemplate: prefs.selectedTemplate,
      llmTxtEnabled: prefs.llmTxtEnabled,
      customDomain: prefs.customDomain,
      resumeGraph,
    };
  }
}
