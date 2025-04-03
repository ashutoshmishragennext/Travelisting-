ALTER TYPE "user_role" ADD VALUE 'SUPER_ADMIN';--> statement-breakpoint
ALTER TABLE "vendor_profiles" ALTER COLUMN "bussiness_type" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "vendor_profiles" ALTER COLUMN "bussiness_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "deals" DROP COLUMN IF EXISTS "deal_type";