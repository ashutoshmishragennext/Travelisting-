DO $$ BEGIN
 CREATE TYPE "public"."bussiness_types" AS ENUM('B2B', 'B2C');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "vendor_profiles" ADD COLUMN "bussiness_type" "bussiness_types" DEFAULT 'B2B' NOT NULL;