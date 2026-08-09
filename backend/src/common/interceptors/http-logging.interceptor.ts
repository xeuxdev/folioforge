import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

const SENSITIVE_KEYS = [
  'password',
  'pass',
  'token',
  'authorization',
  'accesstoken',
  'refreshtoken',
  'secret',
  'cookie',
  'cookieheader',
];

function sanitizeValue(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    if (data.length > 2000) {
      return `${data.slice(0, 200)}... [Truncated ${data.length} chars]`;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeValue(item));
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      if (
        SENSITIVE_KEYS.some((sensitive) =>
          key.toLowerCase().includes(sensitive),
        )
      ) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeValue(value);
      }
    }
    return sanitized;
  }

  return data;
}

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const { method, originalUrl, query, body } = request;
    const startTime = Date.now();

    const hasQuery = query && Object.keys(query).length > 0;
    const hasBody = body && Object.keys(body).length > 0;

    let reqMsg = `${method} ${originalUrl}`;
    if (hasQuery) {
      reqMsg += `\n  📥 Query: ${JSON.stringify(sanitizeValue(query))}`;
    }
    if (hasBody) {
      reqMsg += `\n  📥 Payload: ${JSON.stringify(sanitizeValue(body), null, 2)}`;
    }

    this.logger.log(`➡️  [Request] ${reqMsg}`);

    return next.handle().pipe(
      tap({
        next: (responseData: unknown) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          const sanitizedResponse = sanitizeValue(responseData);

          let resMsg = `${method} ${originalUrl} ${statusCode} +${duration}ms`;
          if (sanitizedResponse !== undefined) {
            resMsg += `\n  📤 Response Body:\n${JSON.stringify(sanitizedResponse, null, 2)}`;
          }

          if (statusCode >= 400) {
            this.logger.warn(`⬅️  [Response] ${resMsg}`);
          } else {
            this.logger.log(`⬅️  [Response] ${resMsg}`);
          }
        },
        error: (error: unknown) => {
          const duration = Date.now() - startTime;
          const statusCode =
            (error as { status?: number }).status ??
            (error as { getStatus?: () => number }).getStatus?.() ??
            500;
          const errorResponse =
            (error as { getResponse?: () => unknown }).getResponse?.() ??
            (error as { response?: unknown }).response ??
            (error as { message?: string }).message ??
            error;

          const resMsg = `${method} ${originalUrl} ${statusCode} +${duration}ms\n  📤 Response Error:\n${JSON.stringify(sanitizeValue(errorResponse), null, 2)}`;
          this.logger.error(`❌ [Response Error] ${resMsg}`);
        },
      }),
    );
  }
}
