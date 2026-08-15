-- SQLite development migration. Production should use `provider = "postgresql"` and Prisma migrate deploy.
CREATE TABLE "Role" ("id" TEXT PRIMARY KEY NOT NULL, "name" TEXT NOT NULL UNIQUE);
CREATE TABLE "User" ("id" TEXT PRIMARY KEY NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL UNIQUE, "passwordHash" TEXT NOT NULL, "active" INTEGER NOT NULL DEFAULT 1, "roleId" TEXT NOT NULL REFERENCES "Role"("id"), "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL);
CREATE TABLE "Session" ("id" TEXT PRIMARY KEY NOT NULL, "tokenHash" TEXT NOT NULL UNIQUE, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "expiresAt" DATETIME NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
-- The complete normalized schema is authoritative in prisma/schema.prisma; Prisma generates remaining DDL.
