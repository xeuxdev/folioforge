import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { validate } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ResumesModule } from './resumes/resumes.module';
import { TailorModule } from './tailor/tailor.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ─── Environment & Config ──────────────────────────────────────────────────
    // isGlobal: true means every other module can inject ConfigService without
    // importing ConfigModule again — follows arch-module-sharing rule.
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),

    // ─── Rate Limiting ─────────────────────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        ttl: 60_000, // 1 minute window
        limit: 100, // 100 requests per window
      },
    ]),

    // ─── Database ──────────────────────────────────────────────────────────────
    DatabaseModule,

    // ─── Feature Modules ───────────────────────────────────────────────────────
    HealthModule,
    UsersModule,
    AuthModule,
    ResumesModule,
    TailorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
