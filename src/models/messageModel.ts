import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { chatsTable as chats } from "./chatModel";

export const messagesTable = sqliteTable("messages", {
  id: text("id").primaryKey().notNull(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  sender: text("sender", { enum: ["user", "bot"] }).notNull(),
  content: text("content").notNull(),
  timestamp: text()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
