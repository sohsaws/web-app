/*
  Warnings:

  - The primary key for the `topic_search` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `topic_search` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "topic_search" DROP CONSTRAINT "topic_search_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "topic_search_pkey" PRIMARY KEY ("id");
