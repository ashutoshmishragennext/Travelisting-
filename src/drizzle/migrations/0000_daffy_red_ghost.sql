DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('USER', 'SALE_PERSON', 'SUPER_ADMIN', 'VENDOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."visibility" AS ENUM('public', 'private');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certifications" (
	"certification_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"certification_name" varchar(200) NOT NULL,
	"issuing_body" varchar(200) NOT NULL,
	"issue_date" date NOT NULL,
	"expiry_date" date NOT NULL,
	"certification_number" varchar(100),
	"verification_url" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" uuid NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" uuid NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_categories" (
	"category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"logo" text,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"product_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"product_name" varchar(200) NOT NULL,
	"description" text,
	"logo" text,
	"required_certifications" text[],
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "references" (
	"reference_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"client_company_name" varchar(200) NOT NULL,
	"client_industry" varchar(100) NOT NULL,
	"project_description" text,
	"service_period_start" date NOT NULL,
	"service_period_end" date NOT NULL,
	"contact_person_name" varchar(100) NOT NULL,
	"contact_email" varchar(100) NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_categories" (
	"category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"logo" text,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"service_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"service_name" varchar(200) NOT NULL,
	"description" text,
	"logo" text,
	"required_certifications" text[],
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"email_verif_token" varchar(255),
	"password" varchar(255) NOT NULL,
	"mobile" text,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"vendor_profile_id" uuid,
	"profile_pic" text,
	"cover_pic" text,
	"secure_profile_pic" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"order_id" varchar(255) NOT NULL,
	"payment_id" varchar(255),
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"status" varchar(50) NOT NULL,
	"payment_method" varchar(50),
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_products" (
	"vendor_product_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"experience_years" integer,
	"photo" text[],
	"description" text,
	"specifications" text,
	"stock" integer,
	"pricing_model" varchar(50),
	"price" text,
	"currency" varchar(3),
	"is_currently_offered" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
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
	"another_emails" text[],
	"business_timing" json,
	"payment_status" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_services" (
	"vendor_service_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"experience_years" integer,
	"photo" text[],
	"mode_of_service" varchar(50),
	"description" varchar(500),
	"pricing_model" varchar(50),
	"price" varchar(50),
	"location" varchar(150),
	"currency" varchar(3),
	"is_currently_offered" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certifications" ADD CONSTRAINT "certifications_vendor_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "references" ADD CONSTRAINT "references_vendor_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_vendor_profile_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_profile_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "vendor_products" ADD CONSTRAINT "vendor_products_vendor_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_products" ADD CONSTRAINT "vendor_products_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_services" ADD CONSTRAINT "vendor_services_vendor_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendor_services" ADD CONSTRAINT "vendor_services_service_id_services_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("service_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_verification_tokens_email_token_key" ON "email_verification_tokens" USING btree ("email","token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_verification_tokens_token_key" ON "email_verification_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_email_token_key" ON "password_reset_tokens" USING btree ("email","token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_key" ON "password_reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_name_email_mobile_idx" ON "users" USING btree ("name","email","mobile");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_product_unique_idx" ON "vendor_products" USING btree ("vendor_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_service_unique_idx" ON "vendor_services" USING btree ("vendor_id","service_id");