import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({
  path: path.resolve(process.cwd(), "packages/database/.env"),
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

console.log("DATABASE_URL loaded:", true);

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});

async function main() {
  console.log("Testing Prisma 7 + PostgreSQL adapter + Neon...");

  const result = await prisma.$queryRaw`SELECT NOW()`;

  console.log("PRISMA PG SUCCESS:", result);
}

main()
  .catch((error) => {
    console.error("PRISMA PG FAILED:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
