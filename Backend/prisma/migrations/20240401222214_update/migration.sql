/*
  Warnings:

  - You are about to drop the column `messageType` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "messageType";

-- DropEnum
DROP TYPE "MessageType";
