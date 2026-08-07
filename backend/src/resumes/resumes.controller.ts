import 'multer';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionGuard } from '../auth/guards/session.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../users/users.service';
import { ResumesService, type ResumeRecord } from './resumes.service';
import type { CanonicalResumeGraph } from '../parser/parser.service';

interface UpdateResumeDto {
  title?: string;
  parsedData?: CanonicalResumeGraph;
}

@Controller('resumes')
@UseGuards(SessionGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB file size limit
      },
      fileFilter: (_req, file, callback) => {
        const allowedMimetypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ];
        if (allowedMimetypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid file format. Only PDF and DOCX files up to 10MB are permitted.',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadResume(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
  ): Promise<ResumeRecord> {
    if (!file) {
      throw new BadRequestException('Please provide a valid PDF or DOCX file.');
    }

    return this.resumesService.uploadAndParseResume({
      userId: user.id,
      file,
      title,
    });
  }

  @Get('me')
  async getMyResumes(@CurrentUser() user: User): Promise<ResumeRecord[]> {
    return this.resumesService.findByUserId(user.id);
  }

  @Get(':id')
  async getResumeById(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<ResumeRecord> {
    return this.resumesService.findByIdForUser(id, user.id);
  }

  @Put(':id')
  async updateResume(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateResumeDto,
  ): Promise<ResumeRecord> {
    return this.resumesService.updateParsedData({
      id,
      userId: user.id,
      title: body.title,
      parsedData: body.parsedData,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteResume(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    await this.resumesService.deleteResume(id, user.id);
  }
}
