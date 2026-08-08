import { Inject, Injectable } from '@nestjs/common';
import { eq, or } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { InferSelectModel } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from '../database/database.module';
import { users } from '../database/schema';
import * as schema from '../database/schema';

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
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  /**
   * Generates a URL-safe slug from a full name.
   * e.g. "Alex Morgan" => "alex-morgan"
   */
  private slugifyName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Finds an available username slug derived from the user's name.
   * If "alex-morgan" is taken, tries "alex-morgan-2", "alex-morgan-3", etc.
   */
  private async findAvailableUsername(
    base: string,
    excludeGoogleId: string,
  ): Promise<string> {
    const existing = await this.db
      .select({ username: users.username, googleId: users.googleId })
      .from(users)
      .where(or(eq(users.username, base)));

    const taken = existing.filter((u) => u.googleId !== excludeGoogleId);

    if (taken.length === 0) return base;

    let counter = 2;
    while (true) {
      const candidate = `${base}-${counter}`;
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
   * Creates a new user or updates name, avatarUrl if the Google account
   * already exists. Auto-generates a unique username slug on first login.
   * Returns the persisted user row.
   */
  async upsertGoogleUser(params: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  }): Promise<User> {
    // Check if user already exists (so we only auto-generate a slug for new users)
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
          // Only set username if it was not already assigned
          ...(usernameSlug ? { username: usernameSlug } : {}),
        },
      })
      .returning();

    return user;
  }
}
