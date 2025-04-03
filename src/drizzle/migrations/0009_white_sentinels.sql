ALTER TABLE "users" ADD COLUMN "email_verified" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verif_token" varchar(255);