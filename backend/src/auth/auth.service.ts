import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, eq, gt } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { OAuth2Client } from 'google-auth-library';
import { DRIZZLE_TOKEN } from '../database/database.module';
import * as schema from '../database/schema';
import { sessions, users } from '../database/schema';
import { UsersService, type User } from '../users/users.service';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

@Injectable()
export class AuthService {
  private readonly oauth2Client: OAuth2Client;

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {
    this.oauth2Client = new OAuth2Client(
      config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
    );
  }

  /**
   * Returns the Google consent-screen URL the browser should be redirected to.
   */
  getGoogleAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile'],
      prompt: 'consent',
    });
  }

  /**
   * Exchanges the one-time code from Google's callback for tokens,
   * verifies the ID token, upserts the user, and returns the user row.
   */
  async exchangeCodeForUser(code: string): Promise<User> {
    const { tokens } = await this.oauth2Client.getToken(code);

    if (!tokens.id_token) {
      throw new UnauthorizedException('No ID token returned from Google');
    }

    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid Google ID token payload');
    }

    return this.usersService.upsertGoogleUser({
      googleId: payload.sub,
      email: payload.email ?? '',
      name: payload.name ?? payload.email ?? '',
      avatarUrl: payload.picture ?? null,
    });
  }

  /**
   * Persists a new session row and returns the opaque token to store in cookie.
   */
  async createSession(userId: string): Promise<string> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await this.db.insert(sessions).values({ userId, token, expiresAt });
    return token;
  }

  /**
   * Validates the cookie token against the sessions table.
   * Returns the user row if valid, throws UnauthorizedException otherwise.
   */
  async validateSession(token: string): Promise<User> {
    const result = await this.db
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
      .limit(1);

    if (!result[0]) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return result[0].user;
  }

  /**
   * Deletes the session row, invalidating the cookie server-side.
   */
  async deleteSession(token: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.token, token));
  }
}
