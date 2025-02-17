// hooks/useMessages.tsx
import { useState, useContext } from "react";
import { sendMessage, editMessage, deleteMessage, retrieveChatMessages, retrieveChats } from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";

export const useMessages = () => {
  const { updateChats } = useContext(UserConfigContext)!;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Helper: refresh chats data.
  const refreshChats = async () => {
    console.log("🔄 Starting refreshChats in useMessages");
    try {
      const chatsRaw = await retrieveChats();
      console.log("📥 Retrieved raw chats:", chatsRaw);
      
      const chats = await Promise.all(
        (chatsRaw || []).map(async (chat: any) => {
          const messages = await retrieveChatMessages(chat.chatID);
          console.log(`📨 Retrieved messages for chat ${chat.chatID}:`, messages);
          
          const mappedMessages = (messages || []).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          return { ...chat, 
            createdAt: new Date(chat.createdAt), 
            updatedAt: new Date(chat.updatedAt), 
            messages: mappedMessages 
          };
        })
      );
      console.log("✅ Processed chats with messages:", chats);
      updateChats(chats);
    } catch (err: any) {
      console.error("❌ Error in refreshChats:", err);
      setError(err.message || "Error refreshing chats");
      throw err;
    }
  };

  // Send a message (auto-creates a chat if needed).
  const sendMsg = async (recipientID: string, text: string) => {
    console.log("📤 Attempting to send message to:", recipientID);
    setLoading(true);
    try {
      const response = await sendMessage(recipientID, text);
      console.log("📨 Send message response:", response);
      await refreshChats();
      return response;
    } catch (err: any) {
      console.error("❌ Error sending message:", err);
      setError(err.message || "Error sending message");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Edit an existing message.
  const editMsg = async (chatId: string, messageId: string, newText: string) => {
    setLoading(true);
    try {
      const response = await editMessage(chatId, messageId, newText);
      await refreshChats();
      return response;
    } catch (err: any) {
      setError(err.message || "Error editing message");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a specific message.
  const deleteMsg = async (chatId: string, messageId: string) => {
    setLoading(true);
    try {
      const response = await deleteMessage(chatId, messageId);
      await refreshChats();
      return response;
    } catch (err: any) {
      setError(err.message || "Error deleting message");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Retrieve messages for a specific chat (without updating global state).
  const getMessages = async (chatId: string) => {
    setLoading(true);
    try {
      const messages = await retrieveChatMessages(chatId);
      return (messages || []).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (err: any) {
      setError(err.message || "Error retrieving messages");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMsg, editMsg, deleteMsg, getMessages, error, loading };
};
