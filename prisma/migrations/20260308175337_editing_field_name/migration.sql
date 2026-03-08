/*
  Warnings:

  - You are about to drop the column `permissao` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "permissao",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
