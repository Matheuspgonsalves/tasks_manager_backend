ALTER TABLE "User" RENAME TO "profiles";

ALTER INDEX "User_pkey" RENAME TO "profiles_pkey";
ALTER INDEX "User_email_key" RENAME TO "profiles_email_key";

ALTER TABLE "profiles" DROP COLUMN "password";
ALTER TABLE "profiles" ALTER COLUMN "id" DROP DEFAULT;
