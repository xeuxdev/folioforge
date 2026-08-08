ALTER TABLE "portfolios" ADD COLUMN "custom_domain" text;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "domain_verification_status" text DEFAULT 'unverified' NOT NULL;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "domain_verification_token" text;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "domain_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_custom_domain_unique" UNIQUE("custom_domain");