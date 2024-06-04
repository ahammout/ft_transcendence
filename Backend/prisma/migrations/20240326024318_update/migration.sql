/*
  Warnings:

  - The primary key for the `Membership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Membership` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `memberId` on the `Mute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Mute" DROP CONSTRAINT "Mute_memberId_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Membership_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Mute" DROP COLUMN "memberId",
ADD COLUMN     "memberId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Mute_memberId_key" ON "Mute"("memberId");

-- AddForeignKey
ALTER TABLE "Mute" ADD CONSTRAINT "Mute_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
