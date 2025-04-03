ALTER TABLE "vendor_profiles" ADD COLUMN "domestic" boolean;--> statement-breakpoint
ALTER TABLE "vendor_profiles" ADD COLUMN "international" boolean;--> statement-breakpoint
ALTER TABLE "vendor_profiles" ADD COLUMN "hotel_chain_ids" text[];