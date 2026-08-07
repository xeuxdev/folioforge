import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { SessionGuard } from '../auth/guards/session.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../users/users.service';
import { TailorService, type BulletDiffItem } from './tailor.service';

interface AnalyzeBody {
  masterResumeId?: string;
  targetRole: string;
  targetCompany: string;
  jobDescription: string;
}

interface UpdateBody {
  matchedKeywords?: string[];
  missingKeywords?: string[];
  bulletDiffs?: BulletDiffItem[];
}

@Controller('tailor')
@UseGuards(SessionGuard)
export class TailorController {
  constructor(private readonly tailorService: TailorService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  async analyzeJob(@CurrentUser() user: User, @Body() body: AnalyzeBody) {
    return this.tailorService.analyzeAndTailor({
      userId: user.id,
      masterResumeId: body.masterResumeId,
      targetRole: body.targetRole,
      targetCompany: body.targetCompany,
      jobDescription: body.jobDescription,
    });
  }

  @Post(':id/ats-check')
  @HttpCode(HttpStatus.OK)
  async evaluateAtsCheck(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tailorService.evaluateAtsCheck(id, user.id);
  }

  @Get('history')
  async getHistory(@CurrentUser() user: User) {
    return this.tailorService.findHistoryForUser(user.id);
  }

  @Get(':id')
  async getById(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tailorService.findByIdForUser(id, user.id);
  }

  @Put(':id')
  async updateRecord(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateBody,
  ) {
    return this.tailorService.updateTailoredRecord({
      id,
      userId: user.id,
      matchedKeywords: body.matchedKeywords,
      missingKeywords: body.missingKeywords,
      bulletDiffs: body.bulletDiffs,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteRecord(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tailorService.deleteTailoredRecord(id, user.id);
  }

  @Post(':id/export/docx')
  async exportDocx(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.tailorService.generateDocxExport(id, user.id);
    const record = await this.tailorService.findByIdForUser(id, user.id);
    const sanitizedFilename = `${record.targetCompany.replace(/[^a-z0-9]/gi, '_')}_${record.targetRole.replace(/[^a-z0-9]/gi, '_')}_Tailored.docx`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
