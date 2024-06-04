/*
  Warnings:

  - You are about to drop the column `udapateState` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "udapateState",
ADD COLUMN     "updateState" BOOLEAN DEFAULT false;
