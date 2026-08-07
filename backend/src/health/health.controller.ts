import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * GET /api/v1/health
   *
   * 200 — all systems up
   * 503 — one or more systems degraded
   *
   * Always returns the full JSON body so monitoring tools can read
   * the detail even when the status code signals a problem.
   */
  @Get()
  async check(@Res() res: Response): Promise<void> {
    const result = await this.healthService.check();
    const statusCode = result.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(result);
  }
}
