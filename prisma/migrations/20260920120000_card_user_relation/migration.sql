-- Existing cards must have an owner before applying this migration to a non-empty table.
ALTER TABLE "card" ADD COLUMN "userId" TEXT NOT NULL;

ALTER TABLE "card" ADD CONSTRAINT "card_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
