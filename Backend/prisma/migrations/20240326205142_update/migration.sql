/*
  Warnings:

  - Added the required column `status` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "status" BOOLEAN NOT NULL;
