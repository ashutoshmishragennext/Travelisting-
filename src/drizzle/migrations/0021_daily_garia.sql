CREATE TABLE IF NOT EXISTS "advertisement_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar DEFAULT 'INR' NOT NULL,
	"status" varchar DEFAULT 'PENDING' NOT NULL,
	"payment_id" varchar,
	"payment_signature" varchar,
	"ad_types" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "advertisements" ADD COLUMN "payment_id" uuid NOT NULL;