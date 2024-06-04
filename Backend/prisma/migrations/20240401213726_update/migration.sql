-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('normal', 'special');

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "messageType" "MessageType";
