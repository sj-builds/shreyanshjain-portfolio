import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/*
|--------------------------------------------------------------------------
| Global Prisma Cache
|--------------------------------------------------------------------------
| Prevents creating multiple Prisma connections during development reloads
|--------------------------------------------------------------------------
*/

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;

  adapter?: PrismaNeon;
};

/*
|--------------------------------------------------------------------------
| Environment Validation
|--------------------------------------------------------------------------
*/

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

/*
|--------------------------------------------------------------------------
| Neon Adapter
|--------------------------------------------------------------------------
*/

const adapter =
  globalForPrisma.adapter ??
  new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });

/*
|--------------------------------------------------------------------------
| Prisma Client
|--------------------------------------------------------------------------
*/

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,

    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

/*
|--------------------------------------------------------------------------
| Development Hot Reload Protection
|--------------------------------------------------------------------------
*/

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;

  globalForPrisma.adapter = adapter;
}
