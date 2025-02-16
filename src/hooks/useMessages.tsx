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
    try {
      const chatsRaw = await retrieveChats();
      const chats = await Promise.all(
        (chatsRaw || []).map(async (chat: any) => {
          const chatId = chat.chatID;
          const createdAt = new Date(chat.createdAt);
          const updatedAt = new Date(chat.updatedAt);
          const messages = await retrieveChatMessages(chatId);
          const mappedMessages = (messages || []).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          return { ...chat, createdAt, updatedAt, messages: mappedMessages };
        })
      );
      updateChats(chats);
    } catch (err: any) {
      setError(err.message || "Error refreshing chats");
      throw err;
    }
  };

  // Send a message (auto-creates a chat if needed).
  const sendMsg = async (recipientID: string, text: string) => {
    setLoading(true);
    try {
      const response = await sendMessage(recipientID, text);
      await refreshChats();
      return response;
    } catch (err: any) {
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
