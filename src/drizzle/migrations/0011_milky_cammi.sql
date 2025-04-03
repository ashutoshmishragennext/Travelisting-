DO $$ BEGIN
 CREATE TYPE "public"."deal_type" AS ENUM('FLIGHT', 'HOTEL', 'PACKAGE', 'CRUISE', 'OTHER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."travel_type" AS ENUM('DOMESTIC', 'INTERNATIONAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"deal_type" "deal_type" NOT NULL,
	"travel_type" "travel_type" NOT NULL,
	"travel_agent_id" uuid NOT NULL,
	"property_id" uuid,
	"description" text,
	"price" numeric(10, 2),
	"discount" numeric(5, 2),
	"images" json,
	"contact_phones" text[],
	"contact_emails" text[],
	"deal_type_definition_id" uuid,
	"metadata" jsonb,
	"flight_details" json,
	"hotel_details" json,
	"formatted_content" json,
	"country" varchar(100),
	"state" varchar(100),
	"city" varchar(100),
	"valid_from" date NOT NULL,
	"valid_to" date NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_promoted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deal_type_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deal_type_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_type_id" uuid NOT NULL,
	"schema" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deals" ADD CONSTRAINT "deals_travel_agent_id_users_id_fk" FOREIGN KEY ("travel_agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deals" ADD CONSTRAINT "deals_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deals" ADD CONSTRAINT "deals_deal_type_definition_id_deal_type_definitions_id_fk" FOREIGN KEY ("deal_type_definition_id") REFERENCES "public"."deal_type_definitions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deal_type_definitions" ADD CONSTRAINT "deal_type_definitions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deal_type_metadata" ADD CONSTRAINT "deal_type_metadata_deal_type_id_deal_type_definitions_id_fk" FOREIGN KEY ("deal_type_id") REFERENCES "public"."deal_type_definitions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deal_type_metadata" ADD CONSTRAINT "deal_type_metadata_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
