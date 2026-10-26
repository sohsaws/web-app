-- The UI language of each user. Existing users get English, the default.
ALTER TABLE "user" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';
