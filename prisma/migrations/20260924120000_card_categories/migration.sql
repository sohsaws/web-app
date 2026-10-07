-- Keep databases updated with db push compatible with the migration history.
ALTER TABLE "card" ADD COLUMN IF NOT EXISTS "category" TEXT[];

-- Existing favorites have no categories until explicitly classified.
UPDATE "card" SET "category" = ARRAY[]::TEXT[] WHERE "category" IS NULL;
