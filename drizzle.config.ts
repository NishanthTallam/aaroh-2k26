import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Neon best practice: Use direct connection (non-pooled) for migrations/push
const directUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  (process.env.DATABASE_URL ? process.env.DATABASE_URL.replace("-pooler.", ".") : "");

export default defineConfig({
  schema: "./src/db/schema",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: directUrl,
  },
});
