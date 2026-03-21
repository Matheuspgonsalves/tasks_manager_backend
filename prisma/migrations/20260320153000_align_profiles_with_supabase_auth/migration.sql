BEGIN;

ALTER TABLE "Tasks" DROP CONSTRAINT IF EXISTS "Tasks_userId_fkey";
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_ownerUserId_fkey";
ALTER TABLE "HiddenCategory" DROP CONSTRAINT IF EXISTS "HiddenCategory_userId_fkey";
ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "profiles_id_fkey";

ALTER TABLE "profiles"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid;

ALTER TABLE "Tasks"
  ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;

ALTER TABLE "Category"
  ALTER COLUMN "ownerUserId" TYPE UUID USING "ownerUserId"::uuid;

ALTER TABLE "HiddenCategory"
  ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_id_fkey"
  FOREIGN KEY ("id") REFERENCES auth.users("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Tasks"
  ADD CONSTRAINT "Tasks_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Category"
  ADD CONSTRAINT "Category_ownerUserId_fkey"
  FOREIGN KEY ("ownerUserId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HiddenCategory"
  ADD CONSTRAINT "HiddenCategory_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Category" ("id", "name", "isDefault", "ownerUserId", "createdAt")
SELECT md5('Tasks gerais'), 'Tasks gerais', true, NULL, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1
  FROM "Category"
  WHERE "name" = 'Tasks gerais'
    AND "isDefault" = true
    AND "ownerUserId" IS NULL
);

INSERT INTO "Category" ("id", "name", "isDefault", "ownerUserId", "createdAt")
SELECT md5('Estudos'), 'Estudos', true, NULL, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1
  FROM "Category"
  WHERE "name" = 'Estudos'
    AND "isDefault" = true
    AND "ownerUserId" IS NULL
);

INSERT INTO "Category" ("id", "name", "isDefault", "ownerUserId", "createdAt")
SELECT md5('Tarefas de casa'), 'Tarefas de casa', true, NULL, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1
  FROM "Category"
  WHERE "name" = 'Tarefas de casa'
    AND "isDefault" = true
    AND "ownerUserId" IS NULL
);

COMMIT;
