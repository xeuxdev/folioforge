import {
  boolean,
  jsonb,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  googleId: text('google_id').unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  username: text('username').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('Master Resume'),
  originalFilename: text('original_filename').notNull(),
  fileKey: text('file_key').notNull(),
  fileType: text('file_type').notNull(), // 'pdf' | 'docx'
  fileSize: integer('file_size').notNull(),
  parsingStatus: text('parsing_status').notNull().default('pending'), // 'pending' | 'processing' | 'completed' | 'failed'
  rawText: text('raw_text'),
  parsedData: jsonb('parsed_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tailoredResumes = pgTable('tailored_resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  masterResumeId: uuid('master_resume_id').references(() => resumes.id, {
    onDelete: 'set null',
  }),
  targetRole: text('target_role').notNull(),
  targetCompany: text('target_company').notNull(),
  jobDescription: text('job_description').notNull(),
  matchedKeywords: jsonb('matched_keywords').notNull(),
  missingKeywords: jsonb('missing_keywords').notNull(),
  bulletDiffs: jsonb('bullet_diffs').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const portfolios = pgTable('portfolios', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  selectedTemplate: text('selected_template').notNull().default('minimal'), // 'minimal' | 'executive'
  subdomain: text('subdomain'),
  llmTxtEnabled: boolean('llm_txt_enabled').notNull().default(true),
  /** The resume whose parsed data drives this user's portfolio. Null = auto (latest). */
  selectedResumeId: uuid('selected_resume_id').references(() => resumes.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
