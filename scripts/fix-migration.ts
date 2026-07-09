import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    DELETE FROM "_prisma_migrations"
    WHERE migration_name = '000_init'
  `);

  console.log("Migration record removed");
}

main().finally(() => prisma.$disconnect());
