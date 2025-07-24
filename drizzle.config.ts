import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/lib/drizzle",
  schema: "./src/models/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
