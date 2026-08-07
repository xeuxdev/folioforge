import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DRIZZLE_TOKEN = Symbol('DRIZZLE_TOKEN');
export const PG_POOL_TOKEN = Symbol('PG_POOL_TOKEN');

/**
 * Resolves automatically to Docker Postgres in dev (via DATABASE_URL)
 * or any hosted provider in prod — same code, just a different env var.
 */
@Global()
@Module({
  providers: [
    // Raw pg Pool — exported so health checks can call pool.query() directly
    // and get real pg error messages without Drizzle wrapping them.
    {
      provide: PG_POOL_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Pool({
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
          ssl:
            config.get<string>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: true }
              : false,
        });
      },
    },

    // Drizzle ORM instance — wraps the same Pool for all feature services
    {
      provide: DRIZZLE_TOKEN,
      inject: [PG_POOL_TOKEN],
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
    },
  ],
  exports: [DRIZZLE_TOKEN, PG_POOL_TOKEN],
})
export class DatabaseModule {}
