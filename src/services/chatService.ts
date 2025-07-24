import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import * as schema from "../models";
import { getMessagesByChatId } from "./messageService";

export const newChat = async () => {
  const newChatId = Bun.randomUUIDv7();
  const newMessagesId = Bun.randomUUIDv7();

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(schema.chatsTable)
        .values({
          id: newChatId,
          currentState: "waiting_order_choice",
        })
        .returning();

      await tx
        .insert(schema.messagesTable)
        .values({
          id: newMessagesId,
          sessionId: newChatId,
          content: "Welcome to our restaurant! What would you like to order?",
          sender: "bot",
        })
        .returning();
    });
    return { chatId: newChatId, messageId: newMessagesId };
  } catch (error) {
    console.error("Error creating new chat:", error);
    throw error;
  }
};

export const respondToChat = async (
  chatId: string,
  response: string,
  senderResponse: string,
  state: string,
  updatedData: Record<string, any>
) => {
  const newMessageId1 = Bun.randomUUIDv7();
  const newMessageId2 = Bun.randomUUIDv7();

  try {
    await db.transaction(async (tx) => {
      await tx.insert(schema.messagesTable).values({
        id: newMessageId1,
        sessionId: chatId,
        content: senderResponse,
        sender: "user",
      });

      await tx.insert(schema.messagesTable).values({
        id: newMessageId2,
        sessionId: chatId,
        content: response,
        sender: "bot",
      });

      await tx
        .update(schema.chatsTable)
        .set({
          currentState: state,
          data: JSON.stringify(updatedData),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.chatsTable.id, chatId));
    });

    return { senderMessageId: newMessageId1, botMessageId: newMessageId2 };
  } catch (error) {
    console.error("Error responding to chat:", error);
    throw error;
  }
};

export const getChatSessionById = async (chatId: string) => {
  try {
    const chat = await db.query.chatsTable.findFirst({
      where: eq(schema.chatsTable.id, chatId),
    });

    return chat;
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }
};

export const getChatConversations = async (chatId: string) => {
  try {
    const chatSession = await getChatSessionById(chatId);

    const messages = await getMessagesByChatId(chatId);

    return {
      chatSession,
      messages,
    };
  } catch (error) {
    console.error("Error fetching chat conversations:", error);
    throw error;
  }
};
