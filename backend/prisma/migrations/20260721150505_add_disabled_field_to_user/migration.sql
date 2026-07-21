-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "googleId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "whatsApp" TEXT,
    "profilePhoto" TEXT,
    "company" TEXT,
    "businessType" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "city" TEXT,
    "country" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "leadScore" INTEGER NOT NULL DEFAULT 0,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("businessType", "city", "company", "country", "createdAt", "email", "googleId", "id", "industry", "leadScore", "name", "password", "phone", "profilePhoto", "role", "updatedAt", "website", "whatsApp") SELECT "businessType", "city", "company", "country", "createdAt", "email", "googleId", "id", "industry", "leadScore", "name", "password", "phone", "profilePhoto", "role", "updatedAt", "website", "whatsApp" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
