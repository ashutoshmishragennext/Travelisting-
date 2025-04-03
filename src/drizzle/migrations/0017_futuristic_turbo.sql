DO $$ BEGIN
 CREATE TYPE "public"."advertisement_type" AS ENUM('BANNER', 'POPUP', 'SIDEBAR', 'FEATURED_DEAL', 'EMAIL', 'NOTIFICATION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'SUPER_ADMIN';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "advertisements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "advertisement_type" NOT NULL,
	"content" jsonb NOT NULL,
	"image_url" text,
	"redirect_url" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"target_audience" jsonb,
	"metrics" jsonb,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deals" ADD COLUMN "advertisements" jsonb;--> statement-breakpoint
ALTER TABLE "hotel_chains" ADD COLUMN "advertisements" jsonb;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "advertisements" jsonb;--> statement-breakpoint
ALTER TABLE "travel_agent_deals" ADD COLUMN "advertisements" jsonb;--> statement-breakpoint
ALTER TABLE "vendor_profiles" ADD COLUMN "advertisements" jsonb;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
