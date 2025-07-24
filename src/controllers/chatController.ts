import express from "express";
import {
  getChatSessionById,
  newChat,
  respondToChat,
  getChatConversations,
} from "../services/chatService";

export const chatRouter = express.Router();

chatRouter.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const chatSession = await getChatConversations(chatId);
    if (!chatSession.chatSession) {
      return res.status(404).json({ message: "Chat session not found." });
    }

    res.status(200).json(chatSession);
  } catch (error) {
    console.error("Error fetching chat session:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

chatRouter.post("/", async (req, res) => {
  try {
    const { chatId, messageId } = await newChat();
    res.status(201).json({
      chatId,
      messageId,
      message: "Welcome to our restaurant! What would you like to order?",
      options: ["pizza", "pasta", "salad"],
    });
  } catch (error) {
    console.error("Error creating new chat:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

chatRouter.post("/:chatId/respond", async (req, res) => {
  const { chatId } = req.params;
  const { response: rawResponse } = req.body;
  if (!rawResponse) {
    return res.status(400).json({ message: "Response is required." });
  }

  console.log("Received response:", rawResponse);

  const response = rawResponse.toLowerCase().replace(/[^a-z0-9_]/g, "_");

  try {
    const chatSession = await getChatSessionById(chatId);
    if (!chatSession) {
      return res.status(404).json({ message: "Chat session not found." });
    }

    console.log("Chat session:", chatSession);

    let nextState = "";
    let updatedData: {
      [key: string]: string;
    } = {};

    if (chatSession.data) {
      if (typeof chatSession.data === "string") {
        try {
          updatedData = JSON.parse(chatSession.data);
        } catch (error) {
          console.error("Error parsing chat session data:", error);
          updatedData = {};
        }
      } else if (typeof chatSession.data === "object") {
        updatedData = { ...chatSession.data };
      }
    }

    let nextOptions: string[] = [];
    let nextMessage = "";

    switch (chatSession.currentState) {
      case "waiting_order_choice":
        if (response === "pizza") {
          nextState = "waiting_pizza_crust";
          updatedData = {
            ...updatedData,
            orderChoice: "pizza",
          };
          nextOptions = ["thin_crust", "thick_crust"];
          nextMessage =
            "Excellent! What kind of crust would you prefer for your Pizza?";
        } else if (response === "pasta") {
          nextState = "waiting_pasta_sauce";
          updatedData = {
            ...updatedData,
            orderChoice: "pasta",
          };
          nextOptions = ["marinara", "alfredo", "pesto"];
          nextMessage = "Great! Which sauce would you like with your Pasta?";
        } else if (response === "salad") {
          nextState = "waiting_payment_choice";
          updatedData = {
            ...updatedData,
            orderChoice: "salad",
          };
          nextMessage = "How would you like to pay?";
          nextOptions = ["credit_card", "cash", "mobile_pay"];
        } else {
          return res.status(400).json({
            message:
              "Invalid order choice. Please choose pizza, pasta, or salad.",
          });
        }
        break;
      case "waiting_pizza_crust":
        if (response === "thin_crust") {
          nextState = "waiting_payment_choice";
          updatedData = {
            ...updatedData,
            subItem: "thin_crust",
          };
          nextMessage = "How would you like to pay?";
          nextOptions = ["credit_card", "cash", "mobile_pay"];
        } else if (response === "thick_crust") {
          nextState = "waiting_payment_choice";
          updatedData = {
            ...updatedData,
            subItem: "thick_crust",
          };
          nextMessage = "How would you like to pay?";
          nextOptions = ["credit_card", "cash", "mobile_pay"];
        } else {
          return res.status(400).json({
            message:
              "Invalid crust choice. Please choose thin_crust or thick_crust.",
          });
        }
        break;
      case "waiting_pasta_sauce":
        if (response === "marinara") {
          nextState = "waiting_payment_choice";
          updatedData = {
            ...updatedData,
            subItem: "marinara",
          };
          nextMessage = "How would you like to pay?";
          nextOptions = ["credit_card", "cash", "mobile_pay"];
        } else if (response === "alfredo") {
          nextState = "waiting_payment_choice";
          updatedData = {
            ...updatedData,
            subItem: "alfredo",
          };
          nextMessage = "How would you like to pay?";
          nextOptions = ["credit_card", "cash", "mobile_pay"];
        } else if (response === "pesto") {
          nextState = "waiting_payment_choice";
          updatedData = {
            ...updatedData,
            subItem: "pesto",
          };
          nextMessage = "How would you like to pay?";
          nextOptions = ["credit_card", "cash", "mobile_pay"];
        } else {
          return res.status(400).json({
            message:
              "Invalid sauce choice. Please choose marinara, alfredo, or pesto.",
          });
        }
        break;
      case "waiting_payment_choice":
        if (response === "credit_card") {
          nextState = "done";
          updatedData = {
            ...updatedData,
            paymentMethod: "credit_card",
          };
          nextOptions = [];
        } else if (response === "cash") {
          nextState = "done";
          updatedData = {
            ...updatedData,
            paymentMethod: "cash",
          };
          nextOptions = [];
        } else if (response === "mobile_pay") {
          nextState = "done";
          updatedData = {
            ...updatedData,
            paymentMethod: "mobile_pay",
          };
          nextOptions = [];
        } else {
          return res.status(400).json({
            message:
              "Invalid payment choice. Please choose credit_card, cash, or mobile_pay.",
          });
        }
        nextMessage = `Thank you for your order! Your ${
          updatedData.orderChoice
        }${
          updatedData.subItem ? ` with ${updatedData.subItem}` : ""
        } will be ready shortly. You chose to pay with ${
          updatedData.paymentMethod
        }.`;
        break;
      case "done":
        nextMessage = `Thank you for your order! Your ${
          updatedData.orderChoice
        }${
          updatedData.subItem ? ` with ${updatedData.subItem}` : ""
        } will be ready shortly. You chose to pay with ${
          updatedData.paymentMethod
        }.`;
        nextOptions = [];
        nextState = "done";
        break;
      default:
        return res.status(400).json();
    }

    const result = await respondToChat(
      chatId,
      nextMessage,
      response,
      nextState,
      updatedData
    );
    res.status(200).json({
      chatId,
      senderMessageId: result.senderMessageId,
      botMessageId: result.botMessageId,
      message: nextMessage,
      options: nextOptions,
    });
  } catch (error) {
    console.error("Error responding to chat:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
