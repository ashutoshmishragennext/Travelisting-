CREATE TABLE IF NOT EXISTS "advertisement_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"category_type" varchar(50) NOT NULL,
	"category_id" uuid NOT NULL,
	"item_id" uuid,
	"image" text,
	"contact_number" varchar(20),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"validity_years" integer NOT NULL,
	"commission" numeric(10, 2) NOT NULL,
	"features" json,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales_commissions" ADD COLUMN "plan_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_payments" ADD COLUMN "plan_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "advertisement_plans" ADD CONSTRAINT "advertisement_plans_vendor_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_commissions" ADD CONSTRAINT "sales_commissions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_payments" ADD CONSTRAINT "vendor_payments_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sales_commissions" DROP COLUMN IF EXISTS "total_revenue";--> statement-breakpoint
ALTER TABLE "sales_commissions" DROP COLUMN IF EXISTS "net_revenue";