import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { InferSelectModel } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../database/database.module';
import { portfolios, resumes, users } from '../database/schema';
import * as schema from '../database/schema';
import type { CanonicalResumeGraph } from '../parser/parser.service';
import type {
  PortfolioPreferencesDto,
  PublicPortfolioDto,
  UpdatePortfolioPreferencesDto,
} from './dto/portfolio.dto';

type PortfolioRecord = InferSelectModel<typeof portfolios>;

const TEMPLATE_VALUES = ['minimal', 'executive'] as const;
type Template = (typeof TEMPLATE_VALUES)[number];

function isTemplate(value: string): value is Template {
  return (TEMPLATE_VALUES as readonly string[]).includes(value);
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

    return {
      id: record.id,
      userId: record.userId,
      selectedTemplate: template,
      subdomain: record.subdomain,
      llmTxtEnabled: record.llmTxtEnabled,
      selectedResumeId: record.selectedResumeId ?? null,
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
   * Pass selectedResumeId: null to revert to auto (latest resume).
   */
  async updatePreferences(
    userId: string,
    dto: UpdatePortfolioPreferencesDto,
  ): Promise<PortfolioPreferencesDto> {
    // Ensure the row exists first
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

    // If a selectedResumeId is provided, verify it belongs to this user
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
        // Allow explicit null to clear the pin (revert to auto-latest)
        ...(dto.selectedResumeId !== undefined
          ? { selectedResumeId: dto.selectedResumeId }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(portfolios.userId, userId))
      .returning();

    return this.toPreferencesDto(updated);
  }

  /**
   * Resolves a public portfolio by username slug.
   * Uses the pinned resume if set, otherwise falls back to the latest.
   */
  async getPublicPortfolio(username: string): Promise<PublicPortfolioDto> {
    // 1. Resolve user by username slug
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

    // 2. Get portfolio preferences (creates default if absent)
    const prefs = await this.getOrCreatePreferences(user.id);

    // 3. Fetch resume — pinned if set, otherwise auto-select latest
    let resumeGraph: CanonicalResumeGraph | null = null;

    if (prefs.selectedResumeId) {
      // Use the explicitly pinned resume
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
      // Auto-select the most recently updated resume
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
      resumeGraph,
    };
  }
}
