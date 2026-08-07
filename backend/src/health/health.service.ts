import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'pg';
import { PG_POOL_TOKEN } from '../database/database.module';
import type { DbHealthResult, HealthResponse } from './health.types';

@Injectable()
export class HealthService {
  constructor(
    @Inject(PG_POOL_TOKEN)
    private readonly pool: Pool,
  ) {}

  async check(): Promise<HealthResponse> {
    const database = await this.checkDatabase();

    return {
      status: database.status === 'up' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database,
    };
  }

  private async checkDatabase(): Promise<DbHealthResult> {
    const start = Date.now();
    try {
      // Use pool.query() directly — bypasses Drizzle's error wrapper
      // so pg surfaces the real error (ECONNREFUSED, auth failure, etc.)
      await this.pool.query('SELECT 1');
      return { status: 'up', latencyMs: Date.now() - start };
    } catch (error) {
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
