DO $$ BEGIN
 CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"duration_days" integer NOT NULL,
	"ad_type" "advertisement_type" NOT NULL,
	"features" jsonb,
	"max_impressions" integer,
	"max_clicks" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_advertisement_purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"advertisement_type_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"ad_content" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"order_id" varchar(255) NOT NULL,
	"payment_id" varchar(255),
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"payment_method" varchar(50),
	"transaction_details" jsonb,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_advertisement_purchases" ADD CONSTRAINT "vendor_advertisement_purchases_vendor_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_advertisement_purchases" ADD CONSTRAINT "vendor_advertisement_purchases_advertisement_type_id_advertise_type_definitions_id_fk" FOREIGN KEY ("advertisement_type_id") REFERENCES "public"."advertise_type_definitions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_advertisement_purchases" ADD CONSTRAINT "vendor_advertisement_purchases_payment_id_vendor_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."vendor_payments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_payments" ADD CONSTRAINT "vendor_payments_vendor_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_payments" ADD CONSTRAINT "vendor_payments_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
