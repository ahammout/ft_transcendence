/*
  Warnings:

  - You are about to drop the `_BlockedBy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FriendRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "_BlockedBy" DROP CONSTRAINT "_BlockedBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlockedBy" DROP CONSTRAINT "_BlockedBy_B_fkey";

-- DropForeignKey
ALTER TABLE "_FriendRequests" DROP CONSTRAINT "_FriendRequests_A_fkey";

-- DropForeignKey
ALTER TABLE "_FriendRequests" DROP CONSTRAINT "_FriendRequests_B_fkey";

-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_B_fkey";

-- DropTable
DROP TABLE "_BlockedBy";

-- DropTable
DROP TABLE "_FriendRequests";

-- DropTable
DROP TABLE "_Friends";

-- CreateTable
CREATE TABLE "frinds" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "block" BOOLEAN NOT NULL,

    CONSTRAINT "frinds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "frinds" ADD CONSTRAINT "frinds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frinds" ADD CONSTRAINT "frinds_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
