/*
  Warnings:

  - You are about to drop the column `userAccountId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `user_accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `user_accounts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userAccountId_fkey";

-- DropIndex
DROP INDEX "user_accounts_email_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "userAccountId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_accounts" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_userId_key" ON "user_accounts"("userId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_accounts"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
