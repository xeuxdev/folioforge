import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
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

  /**
   * Creates a new user or updates name and avatarUrl if the Google account
   * already exists. Returns the persisted user row.
   */
  async upsertGoogleUser(params: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  }): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values({
        googleId: params.googleId,
        email: params.email,
        name: params.name,
        avatarUrl: params.avatarUrl,
      })
      .onConflictDoUpdate({
        target: users.googleId,
        set: {
          name: params.name,
          avatarUrl: params.avatarUrl,
          updatedAt: new Date(),
        },
      })
      .returning();

    return user;
  }
}
