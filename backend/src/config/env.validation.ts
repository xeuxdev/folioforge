import {
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1)
  PORT: number = 8080;

  // Works for both Docker (dev) and any hosted URL (prod)
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @MinLength(32)
  SESSION_SECRET: string;

  @IsUrl({ require_tld: false })
  FRONTEND_URL: string;

  // Optional — only required when auth is wired up
  @IsString()
  GOOGLE_CLIENT_ID?: string;

  @IsString()
  GOOGLE_CLIENT_SECRET?: string;

  @IsString()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  REDIS_PORT: number = 6379;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
