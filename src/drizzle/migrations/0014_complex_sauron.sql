ALTER TYPE "user_role" ADD VALUE 'SUPER_ADMIN';--> statement-breakpoint
ALTER TABLE "deals" DROP COLUMN IF EXISTS "deal_type";