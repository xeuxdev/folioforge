import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { eq, or } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { InferSelectModel } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../database/database.module';
import { users } from '../database/schema';
import * as schema from '../database/schema';
import { RESERVED_USERNAMES } from 'src/common/reserved';

export type User = InferSelectModel<typeof users>;

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async findByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1);
    return result[0];
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1);
    return result[0];
  }

  /**
   * Generates a URL-safe slug from a full name.
   */
  private slugifyName(name: string): string {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || 'user';
  }

  /**
   * Finds an available username slug derived from the user's name.
   */
  private async findAvailableUsername(
    base: string,
    excludeGoogleId: string,
  ): Promise<string> {
    const cleanBase = RESERVED_USERNAMES.has(base) ? `cv-${base}` : base;

    const existing = await this.db
      .select({ username: users.username, googleId: users.googleId })
      .from(users)
      .where(or(eq(users.username, cleanBase)));

    const taken = existing.filter((u) => u.googleId !== excludeGoogleId);

    if (taken.length === 0) return cleanBase;

    let counter = 2;
    while (true) {
      const candidate = `${cleanBase}-${counter}`;
      const conflict = await this.db
        .select({ id: users.id })
        .from(users)
        .where(or(eq(users.username, candidate)))
        .limit(1);

      if (conflict.length === 0) return candidate;
      counter++;
    }
  }

  /**
   * Validates username string against reserved list and character rules.
   */
  validateUsernameFormat(username: string): string {
    const clean = username.trim().toLowerCase();

    if (clean.length < 3) {
      throw new BadRequestException(
        'Username must be at least 3 characters long.',
      );
    }
    if (clean.length > 30) {
      throw new BadRequestException('Username cannot exceed 30 characters.');
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean)) {
      throw new BadRequestException(
        'Username can only contain lowercase letters, numbers, and single hyphens.',
      );
    }
    if (RESERVED_USERNAMES.has(clean)) {
      throw new BadRequestException(
        `The username '${clean}' is reserved and cannot be claimed.`,
      );
    }

    return clean;
  }

  /**
   * Creates a new user or updates name, avatarUrl if the Google account exists.
   */
  async upsertGoogleUser(params: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  }): Promise<User> {
    const existing = await this.findByGoogleId(params.googleId);

    let usernameSlug: string | undefined;
    if (!existing?.username) {
      const base = this.slugifyName(params.name);
      usernameSlug = await this.findAvailableUsername(base, params.googleId);
    }

    const [user] = await this.db
      .insert(users)
      .values({
        googleId: params.googleId,
        email: params.email,
        name: params.name,
        avatarUrl: params.avatarUrl,
        username: usernameSlug,
      })
      .onConflictDoUpdate({
        target: users.googleId,
        set: {
          name: params.name,
          avatarUrl: params.avatarUrl,
          updatedAt: new Date(),
          ...(usernameSlug ? { username: usernameSlug } : {}),
        },
      })
      .returning();

    return user;
  }

  /**
   * Updates user name, username, or avatar URL with strict validation.
   */
  async updateUserProfile(
    userId: string,
    updates: { name?: string; username?: string; avatarUrl?: string | null },
  ): Promise<User> {
    let cleanUsername: string | undefined;

    if (updates.username !== undefined && updates.username.trim() !== '') {
      cleanUsername = this.validateUsernameFormat(updates.username);

      // Check if another user already claimed this username
      const existing = await this.findByUsername(cleanUsername);
      if (existing && existing.id !== userId) {
        throw new BadRequestException(
          `The username '${cleanUsername}' is already taken by another account.`,
        );
      }
    }

    const [updated] = await this.db
      .update(users)
      .set({
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(cleanUsername !== undefined ? { username: cleanUsername } : {}),
        ...(updates.avatarUrl !== undefined
          ? { avatarUrl: updates.avatarUrl }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return updated;
  }
}
