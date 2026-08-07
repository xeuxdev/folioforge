import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── Security headers ────────────────────────────────────────────────────────
  app.use(helmet());

  // ─── Global prefix ───────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ─── CORS ────────────────────────────────────────────────────────────────────
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // ─── Global validation pipe ──────────────────────────────────────────────────
  // Strips unknown properties and validates all DTOs via class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 FolioForge API running on http://localhost:${port}/api/v1`);
}

void bootstrap();
