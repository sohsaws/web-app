/*
  Warnings:

  - A unique constraint covering the columns `[access_token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `verification_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "access_token" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "verification_tokens" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "topic_search" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "topic_search_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "topic_search_topic_idx" ON "topic_search"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_access_token_key" ON "sessions"("access_token");
