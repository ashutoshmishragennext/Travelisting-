CREATE TABLE IF NOT EXISTS "sales_commissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sales_person_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL,
	"total_revenue" numeric(10, 2) NOT NULL,
	"commission_amount" numeric(10, 2) NOT NULL,
	"net_revenue" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_commissions" ADD CONSTRAINT "sales_commissions_sales_person_id_users_id_fk" FOREIGN KEY ("sales_person_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_commissions" ADD CONSTRAINT "sales_commissions_vendor_id_vendor_profiles_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor_profiles"("vendor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_commissions" ADD CONSTRAINT "sales_commissions_payment_id_vendor_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."vendor_payments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
