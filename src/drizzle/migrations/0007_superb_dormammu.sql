DO $$ BEGIN
 CREATE TYPE "public"."deal_status" AS ENUM('PENDING', 'NEGOTIATING', 'APPROVED', 'REJECTED', 'COMPLETED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."property_type" AS ENUM('HOTEL', 'RESORT', 'HOMESTAY', 'VILLA', 'HOSTEL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'TRAVEL_AGENT';--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'HOTEL_ADMIN';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communication_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"message_type" varchar(50),
	"message" text,
	"attachments" json,
	"read_status" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hotel_chains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"website_url" text,
	"headquarters" text,
	"properties_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"property_type" "property_type" NOT NULL,
	"category" varchar(50),
	"subcategory" varchar(50),
	"star_rating" integer,
	"chain_id" uuid,
	"address" text,
	"state" text,
	"city" text,
	"pincode" varchar(20),
	"contact_name" varchar(100),
	"contact_email" varchar(255),
	"contact_phone" varchar(20),
	"amenities" json,
	"photos" json,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "travel_agent_deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_agent_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"commission_rate" numeric(5, 2),
	"status" "deal_status" DEFAULT 'PENDING' NOT NULL,
	"valid_from" date,
	"valid_to" date,
	"special_rates" json,
	"special_conditions" text,
	"room_types" json,
	"discount_details" json,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "advertisement_plans";--> statement-breakpoint
DROP TABLE "certifications";--> statement-breakpoint
DROP TABLE "product_categories";--> statement-breakpoint
DROP TABLE "products";--> statement-breakpoint
DROP TABLE "references";--> statement-breakpoint
DROP TABLE "sales_commissions";--> statement-breakpoint
DROP TABLE "service_categories";--> statement-breakpoint
DROP TABLE "services";--> statement-breakpoint
DROP TABLE "vendor_payments";--> statement-breakpoint
DROP TABLE "vendor_products";--> statement-breakpoint
DROP TABLE "vendor_profiles";--> statement-breakpoint
DROP TABLE "vendor_services";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_vendor_profile_id_vendor_profiles_vendor_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "users_name_email_mobile_idx";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'TRAVEL_AGENT';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_name" varchar(200);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gst_number" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "specializations" text[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_deal_id_travel_agent_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."travel_agent_deals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "properties" ADD CONSTRAINT "properties_chain_id_hotel_chains_id_fk" FOREIGN KEY ("chain_id") REFERENCES "public"."hotel_chains"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "travel_agent_deals" ADD CONSTRAINT "travel_agent_deals_travel_agent_id_users_id_fk" FOREIGN KEY ("travel_agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "travel_agent_deals" ADD CONSTRAINT "travel_agent_deals_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_name_email_idx" ON "users" USING btree ("name","email");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verif_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "vendor_profile_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "cover_pic";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "secure_profile_pic";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "created_by";