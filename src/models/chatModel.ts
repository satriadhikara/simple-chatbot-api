import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const chatsTable = sqliteTable("chats", {
  id: text("id").primaryKey().notNull(),
  data: text("data", { mode: "json" }),
  currentState: text("current_state"),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
