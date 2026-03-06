-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
ALTER TABLE "User" ADD COLUMN "phone" TEXT;

-- CreateTable
CREATE TABLE "CashMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CashMovement_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "creditLimit" REAL NOT NULL DEFAULT 0,
    "currentCredit" REAL NOT NULL DEFAULT 0,
    "loyaltyStatus" TEXT NOT NULL DEFAULT 'NONE',
    "totalPurchases" INTEGER NOT NULL DEFAULT 0,
    "insuranceProvider" TEXT,
    "insuranceNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Client" ("address", "code", "createdAt", "email", "id", "insuranceNumber", "insuranceProvider", "name", "phone", "updatedAt") SELECT "address", "code", "createdAt", "email", "id", "insuranceNumber", "insuranceProvider", "name", "phone", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_code_key" ON "Client"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
