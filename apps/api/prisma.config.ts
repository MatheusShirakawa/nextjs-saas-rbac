import { config as dotenvConfig } from "dotenv";
import { defineConfig } from "prisma/config";

dotenvConfig()

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});