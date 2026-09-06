import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

declare global {
  var prisma: PrismaClient | undefined;
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error(
    "Please check your .env file and make sure DATABASE_URL is defined.",
  );
  throw new Error("DATABASE_URL environment variable is required");
}

console.log(
  "✅ DATABASE_URL is set:",
  process.env.DATABASE_URL.substring(0, 30) + "...",
);

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prismadb =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismadb;
}

export default prismadb;
