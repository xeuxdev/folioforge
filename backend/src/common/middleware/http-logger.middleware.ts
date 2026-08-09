import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const requestIdHeader = request.headers['x-request-id'];
    const requestId = Array.isArray(requestIdHeader)
      ? requestIdHeader[0]
      : (requestIdHeader ?? randomUUID());

    response.setHeader('x-request-id', requestId);

    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') ?? '-';
    const startTime = Date.now();

    let isLogged = false;

    const logResponse = (isClosedPrematurely = false): void => {
      if (isLogged) {
        return;
      }
      isLogged = true;

      const { statusCode } = response;
      const contentLength = response.get('content-length') ?? '0';
      const duration = Date.now() - startTime;
      const statusNote = isClosedPrematurely ? ' (Closed Prematurely)' : '';

      const logMessage = `${method} ${originalUrl} ${statusCode} ${duration}ms - ${contentLength}b - [${ip}] [reqId: ${requestId}] "${userAgent}"${statusNote}`;

      if (statusCode >= 500 || isClosedPrematurely) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    };

    response.on('finish', () => logResponse(false));
    response.on('close', () => {
      if (!response.writableEnded) {
        logResponse(true);
      }
    });

    next();
  }
}
