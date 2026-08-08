import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { SessionGuard } from '../auth/guards/session.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../users/users.service';
import { PortfolioService } from './portfolio.service';
import type {
  PortfolioPreferencesDto,
  PublicPortfolioDto,
  UpdatePortfolioPreferencesDto,
  SetCustomDomainDto,
  CustomDomainVerificationResultDto,
} from './dto/portfolio.dto';
import type { CanonicalResumeGraph } from '../parser/parser.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // ─── Public endpoints (no auth) ────────────────────────────────────────────

  /** Returns the merged public portfolio JSON for a given username slug. */
  @Get('u/:username')
  async getPublicPortfolio(
    @Param('username') username: string,
  ): Promise<PublicPortfolioDto> {
    return this.portfolioService.getPublicPortfolio(username);
  }

  /** Resolves a public portfolio payload by custom domain name. */
  @Get('domain/resolve')
  async getPublicPortfolioByCustomDomain(
    @Query('domain') domain: string,
  ): Promise<PublicPortfolioDto> {
    return this.portfolioService.getPublicPortfolioByCustomDomain(domain);
  }

  /**
   * Returns a plain-text llm.txt markdown document for the given username.
   * Served as text/plain so LLM crawlers and recruiting agents can parse it.
   */
  @Get('u/:username/llm.txt')
  async getLlmTxt(
    @Param('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    const portfolio = await this.portfolioService.getPublicPortfolio(username);

    if (!portfolio.llmTxtEnabled) {
      res.status(HttpStatus.NOT_FOUND).send('Not found');
      return;
    }

    const graph: CanonicalResumeGraph | null = portfolio.resumeGraph;
    const contact = graph?.contactInfo ?? {};
    const markdown = this.buildLlmTxt(portfolio.name, username, contact, graph);

    res
      .status(HttpStatus.OK)
      .set({
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      })
      .send(markdown);
  }

  // ─── Authenticated endpoints ───────────────────────────────────────────────

  /** Fetches (or seeds) the current user's portfolio preferences. */
  @Get('preferences')
  @UseGuards(SessionGuard)
  async getPreferences(
    @CurrentUser() user: User,
  ): Promise<PortfolioPreferencesDto> {
    return this.portfolioService.getOrCreatePreferences(user.id);
  }

  /** Updates the current user's portfolio preferences. */
  @Patch('preferences')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @CurrentUser() user: User,
    @Body() body: UpdatePortfolioPreferencesDto,
  ): Promise<PortfolioPreferencesDto> {
    return this.portfolioService.updatePreferences(user.id, body);
  }

  /** Sets a custom domain for the user's portfolio. */
  @Post('domain')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  async setCustomDomain(
    @CurrentUser() user: User,
    @Body() body: SetCustomDomainDto,
  ): Promise<PortfolioPreferencesDto> {
    return this.portfolioService.setCustomDomain(user.id, body.customDomain);
  }

  /** Triggers DNS verification for the user's custom domain. */
  @Post('domain/verify')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  async verifyCustomDomain(
    @CurrentUser() user: User,
  ): Promise<CustomDomainVerificationResultDto> {
    return this.portfolioService.verifyCustomDomain(user.id);
  }

  /** Removes custom domain binding from user portfolio. */
  @Delete('domain')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  async removeCustomDomain(
    @CurrentUser() user: User,
  ): Promise<PortfolioPreferencesDto> {
    return this.portfolioService.removeCustomDomain(user.id);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private buildLlmTxt(
    name: string,
    username: string,
    contact: CanonicalResumeGraph['contactInfo'],
    graph: CanonicalResumeGraph | null,
  ): string {
    const lines: string[] = [`# ${name}`, '', `> Username: ${username}`];

    if (contact.email) lines.push(`> Email: ${contact.email}`);
    if (contact.location) lines.push(`> Location: ${contact.location}`);
    if (contact.linkedinUrl) lines.push(`> LinkedIn: ${contact.linkedinUrl}`);
    if (contact.githubUrl) lines.push(`> GitHub: ${contact.githubUrl}`);
    if (contact.websiteUrl) lines.push(`> Portfolio: ${contact.websiteUrl}`);

    if (graph?.summary) {
      lines.push('', '## Professional Summary', graph.summary);
    }

    if (graph?.workExperiences?.length) {
      lines.push('', '## Work Experience');
      for (const exp of graph.workExperiences) {
        const period = [exp.startDate, exp.isCurrent ? 'Present' : exp.endDate]
          .filter(Boolean)
          .join(' - ');
        lines.push(
          `### ${exp.company} - ${exp.position}${period ? ` (${period})` : ''}`,
        );
        if (exp.location) lines.push(`Location: ${exp.location}`);
        if (exp.bullets?.length) {
          lines.push('Key Achievements:');
          for (const bullet of exp.bullets) {
            lines.push(`- ${bullet}`);
          }
        }
        lines.push('');
      }
    }

    if (graph?.projects?.length) {
      lines.push('## Featured Projects');
      for (const proj of graph.projects) {
        lines.push(`### ${proj.title}`);
        if (proj.description) lines.push(proj.description);
        if (proj.technologies?.length)
          lines.push(`Stack: ${proj.technologies.join(', ')}`);
        if (proj.url) lines.push(`URL: ${proj.url}`);
        lines.push('');
      }
    }

    if (graph?.skills?.length) {
      lines.push('## Technical Skills', graph.skills.join(', '), '');
    }

    if (graph?.education?.length) {
      lines.push('## Education');
      for (const edu of graph.education) {
        const degree = [edu.degree, edu.fieldOfStudy]
          .filter(Boolean)
          .join(' in ');
        const period = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
        lines.push(
          `- ${degree ? `${degree}, ` : ''}${edu.institution}${period ? ` (${period})` : ''}`,
        );
      }
    }

    return lines.join('\n');
  }
}
