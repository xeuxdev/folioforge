import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { Readable } from 'stream';

export interface UploadResult {
  fileKey: string;
  bucket: string;
  url: string;
}

export interface PhotoUploadResult {
  fileKey: string;
  publicUrl: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME || 'folioforge-resumes';
    this.publicUrl = (
      process.env.R2_PUBLIC_URL ||
      process.env.PUBLIC_STORAGE_URL ||
      ''
    ).replace(/\/$/, '');

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const customEndpoint = process.env.R2_ENDPOINT;

    const endpoint =
      customEndpoint &&
      customEndpoint.length > 0 &&
      !customEndpoint.includes('<ACCOUNT_ID>')
        ? customEndpoint
        : accountId
          ? `https://${accountId}.r2.cloudflarestorage.com`
          : null;

    if (endpoint && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log(
        `Cloudflare R2 Storage initialized for bucket: ${this.bucketName}`,
      );
    } else {
      this.logger.warn(
        'Cloudflare R2 credentials missing or incomplete. StorageService running in fallback mode.',
      );
    }
  }

  async uploadFile(params: {
    buffer: Buffer;
    originalFilename: string;
    mimeType: string;
    userId: string;
  }): Promise<UploadResult> {
    const sanitizedFilename = params.originalFilename.replace(
      /[^a-zA-Z0-9.-]/g,
      '_',
    );
    const fileKey = `resumes/${params.userId}/${randomUUID()}-${sanitizedFilename}`;
    const url = this.publicUrl
      ? `${this.publicUrl}/${fileKey}`
      : `/api/v1/auth/photos/${fileKey.replace('resumes/', '')}`;

    if (!this.s3Client) {
      this.logger.warn(
        `Fallback mode: Simulating upload for fileKey: ${fileKey}`,
      );
      return { fileKey, bucket: this.bucketName, url };
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: params.buffer,
        ContentType: params.mimeType,
      });

      await this.s3Client.send(command);
      this.logger.log(`Uploaded file to Cloudflare R2: ${fileKey}`);
      return { fileKey, bucket: this.bucketName, url };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown S3 error';
      this.logger.error(
        `Failed to upload file to Cloudflare R2 (${message}). Operating in fallback mode for fileKey: ${fileKey}`,
      );
      return { fileKey, bucket: this.bucketName, url };
    }
  }

  /**
   * Uploads a file buffer to R2 and returns object key + public URL.
   */
  async uploadPhoto(params: {
    buffer: Buffer;
    originalFilename: string;
    mimeType: string;
    userId: string;
  }): Promise<PhotoUploadResult> {
    const sanitizedFilename = params.originalFilename.replace(
      /[^a-zA-Z0-9.-]/g,
      '_',
    );
    const ext = sanitizedFilename.split('.').pop() || 'jpg';
    const photoName = `user-${params.userId}-${randomUUID()}.${ext}`;
    const fileKey = `photos/${photoName}`;

    // If R2_PUBLIC_URL environment variable is set (e.g. https://pub-xxx.r2.dev or custom domain),
    // returns `${this.publicUrl}/${fileKey}` directly.
    // If unconfigured, falls back to endpoint route so images load without S3 authorization XML errors.
    const publicUrl = this.publicUrl
      ? `${this.publicUrl}/${fileKey}`
      : `/api/v1/auth/photos/${photoName}`;

    if (!this.s3Client) {
      this.logger.warn(
        `Fallback mode: Simulating photo upload under photos/ for key: ${fileKey}`,
      );
      return { fileKey, publicUrl };
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: params.buffer,
        ContentType: params.mimeType,
      });

      await this.s3Client.send(command);
      this.logger.log(
        `Uploaded profile photo to Cloudflare R2 under photos/: ${fileKey}`,
      );

      return { fileKey, publicUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown S3 error';
      this.logger.error(
        `Failed to upload photo to Cloudflare R2 (${message}).`,
      );
      return { fileKey, publicUrl };
    }
  }

  async getFileBuffer(fileKey: string): Promise<Buffer | null> {
    if (!this.s3Client) {
      this.logger.warn(
        `Fallback mode: Storage client not configured to retrieve fileKey: ${fileKey}`,
      );
      return null;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);
      if (!response.Body) return null;

      const stream = response.Body as Readable;
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk as Uint8Array);
      }
      return Buffer.concat(chunks);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown S3 error';
      this.logger.error(
        `Failed to download file ${fileKey} from R2: ${message}`,
      );
      return null;
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    if (!this.s3Client) {
      this.logger.warn(
        `Fallback mode: Simulated delete for fileKey: ${fileKey}`,
      );
      return;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);
      this.logger.log(`Deleted file from Cloudflare R2: ${fileKey}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown S3 error';
      this.logger.error(`Failed to delete file ${fileKey} from R2: ${message}`);
    }
  }
}
