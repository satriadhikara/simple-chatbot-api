import { db } from "../lib/db";
import * as schema from "../models";
import { eq } from "drizzle-orm";

export const getMessagesByChatId = async (chatId: string) => {
  try {
    const messages = await db
      .select()
      .from(schema.messagesTable)
      .where(eq(schema.messagesTable.sessionId, chatId));
    return messages;
  } catch (error) {
    console.error("Error fetching messages for chat:", error);
    throw error;
  }
};
