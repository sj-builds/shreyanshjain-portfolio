import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const message = await prisma.message.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      subject: "Database Test",
      message: "Testing portfolio contact database connection.",
    },
  });

  console.log("Message saved:");
  console.log(message);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
