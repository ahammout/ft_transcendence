-- AlterTable
ALTER TABLE "User" ADD COLUMN     "faState" BOOLEAN DEFAULT false,
ADD COLUMN     "is2FAuthenticated" BOOLEAN DEFAULT false,
ADD COLUMN     "twoFactorEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;
