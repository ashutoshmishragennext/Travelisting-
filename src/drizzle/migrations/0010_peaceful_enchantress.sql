CREATE TABLE IF NOT EXISTS "vendor_profiles" (
	"vendor_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"company_name" varchar(200) NOT NULL,
	"legal_entity_type" varchar(50),
	"tax_id" varchar(50),
	"establishment_year" integer,
	"social_links" json,
	"logo" text,
	"cover_image" text,
	"pictures" json,
	"primary_contact_name" varchar(100),
	"primary_contact_email" varchar(100),
	"primary_contact_phone" varchar(20),
	"whatsapp_number" varchar(20),
	"headquarters_address" text,
	"state" text,
	"city" text,
	"pincode" text,
	"our_customers" text[],
	"operating_countries" text[],
	"employee_count_range" varchar(50),
	"annual_revenue_range" varchar(50),
	"regulatory_licenses" text[],
	"insurance_coverage" json,
	"business_opening_days" text[],
	"another_mobile_numbers" text[],
	"advertisment" text[],
	"another_emails" text[],
	"business_timing" json,
	"payment_status" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "vendor_profile_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_vendor_profile_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_profile_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
