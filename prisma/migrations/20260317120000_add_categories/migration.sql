-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HiddenCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HiddenCategory_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN "categoryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Category_ownerUserId_name_key" ON "Category"("ownerUserId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "HiddenCategory_userId_categoryId_key" ON "HiddenCategory"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiddenCategory" ADD CONSTRAINT "HiddenCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiddenCategory" ADD CONSTRAINT "HiddenCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed global default categories
INSERT INTO "Category" ("id", "name", "isDefault", "ownerUserId", "createdAt")
VALUES
    (md5('Tasks gerais'), 'Tasks gerais', true, NULL, CURRENT_TIMESTAMP),
    (md5('Estudos'), 'Estudos', true, NULL, CURRENT_TIMESTAMP),
    (md5('Tarefas de casa'), 'Tarefas de casa', true, NULL, CURRENT_TIMESTAMP);

-- Backfill existing tasks without category to the global default category
UPDATE "Tasks"
SET "categoryId" = md5('Tasks gerais')
WHERE "categoryId" IS NULL;

-- Make category mandatory for tasks
ALTER TABLE "Tasks" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
