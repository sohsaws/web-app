/*
  Warnings:

  - Added the required column `createdAt` to the `card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "card" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isFavorited" BOOLEAN NOT NULL DEFAULT false;
