import type { InferSelectModel } from 'drizzle-orm';
import type { users } from '../../database/schema';

declare global {
  namespace Express {
    interface Request {
      user?: InferSelectModel<typeof users>;
      sessionToken?: string;
    }
  }
}
