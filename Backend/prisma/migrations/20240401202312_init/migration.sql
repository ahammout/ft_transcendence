/*
  Warnings:

  - Added the required column `channelId` to the `Mute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mute" ADD COLUMN     "channelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Mute" ADD CONSTRAINT "Mute_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
