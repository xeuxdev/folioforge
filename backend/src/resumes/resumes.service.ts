import 'multer';
import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { InferSelectModel } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../database/database.module';
import { resumes } from '../database/schema';
import * as schema from '../database/schema';
import { StorageService } from '../storage/storage.service';
import {
  ParserService,
  type CanonicalResumeGraph,
} from '../parser/parser.service';

export type ResumeRecord = InferSelectModel<typeof resumes>;

@Injectable()
export class ResumesService {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly storageService: StorageService,
    private readonly parserService: ParserService,
  ) {}

  async uploadAndParseResume(params: {
    userId: string;
    file: Express.Multer.File;
    title?: string;
  }): Promise<ResumeRecord> {
    const { userId, file, title } = params;

    // 1. Upload to Cloudflare R2 object storage
    const uploadResult = await this.storageService.uploadFile({
      buffer: file.buffer,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      userId,
    });

    // 2. Parse text & convert to canonical resume graph
    let rawText = '';
    let parsedData: CanonicalResumeGraph | null = null;
    let parsingStatus = 'completed';

    try {
      rawText = await this.parserService.extractRawText(
        file.buffer,
        file.mimetype,
      );
      parsedData = await this.parserService.parseTextToResumeGraph(rawText);
    } catch {
      parsingStatus = 'failed';
    }

    console.log(JSON.stringify(parsedData), 'parsed data');
    const fileType = file.mimetype.includes('pdf') ? 'pdf' : 'docx';

    // 3. Persist record in PostgreSQL resumes table
    const [resumeRecord] = await this.db
      .insert(resumes)
      .values({
        userId,
        title: title || file.originalname.replace(/\.[^/.]+$/, ''),
        originalFilename: file.originalname,
        fileKey: uploadResult.fileKey,
        fileType,
        fileSize: file.size,
        parsingStatus,
        rawText,
        parsedData,
      })
      .returning();

    return resumeRecord;
  }

  async findByUserId(userId: string): Promise<ResumeRecord[]> {
    return this.db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async findByIdForUser(id: string, userId: string): Promise<ResumeRecord> {
    const [resume] = await this.db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .limit(1);

    if (!resume) {
      throw new NotFoundException('Resume record not found');
    }

    return resume;
  }

  async updateParsedData(params: {
    id: string;
    userId: string;
    title?: string;
    parsedData?: CanonicalResumeGraph;
  }): Promise<ResumeRecord> {
    const existing = await this.findByIdForUser(params.id, params.userId);
    if (!existing) {
      throw new ForbiddenException('Cannot update this resume');
    }

    const updatePayload: Partial<ResumeRecord> = {
      updatedAt: new Date(),
    };

    if (params.title) {
      updatePayload.title = params.title;
    }

    if (params.parsedData) {
      updatePayload.parsedData = params.parsedData;
    }

    const [updated] = await this.db
      .update(resumes)
      .set(updatePayload)
      .where(and(eq(resumes.id, params.id), eq(resumes.userId, params.userId)))
      .returning();

    return updated;
  }

  async deleteResume(id: string, userId: string): Promise<void> {
    await this.findByIdForUser(id, userId);

    // Remove record link from database (S3/R2 file storage remains intact)
    await this.db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
  }
}
