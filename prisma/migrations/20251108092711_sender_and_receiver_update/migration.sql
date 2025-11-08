/*
  Warnings:

  - Made the column `email` on table `Sender` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Sender` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sender" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
