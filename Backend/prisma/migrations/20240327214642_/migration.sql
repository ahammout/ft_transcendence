-- CreateEnum
CREATE TYPE "State" AS ENUM ('ONLINE', 'OFFLINE', 'ONGAME');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "state" "State" NOT NULL DEFAULT 'OFFLINE';

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
