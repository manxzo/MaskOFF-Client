// hooks/useChat.tsx
import { useState, useContext } from "react";
import { startChat, deleteChat, retrieveChats, retrieveChatMessages } from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";

export const useChat = () => {
  const { updateChats } = useContext(UserConfigContext)!;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<any[]>([]);

  // Common helper: no mapping of participants needed here.
  const fetchAndProcessChats = async () => {
    const chatsRaw = await retrieveChats();
    const chats = await Promise.all(
      (chatsRaw || []).map(async (chat: any) => {
        const messages = await retrieveChatMessages(chat.chatID);
        const mappedMessages = (messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        return {
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: mappedMessages,
        };
      })
    );
    return chats;
  };

  const refreshChats = async () => {
    console.log("🔄 Starting refreshChats in useChat");
    try {
      const chats = await fetchAndProcessChats();
      console.log("✅ Updated chats state with:", chats);
      updateChats(chats);
      setChats(chats);
    } catch (err: any) {
      console.error("❌ Error in refreshChats:", err);
      setError(err.message || "Error refreshing chats");
      throw err;
    }
  };

  const createChat = async (recipientID: string) => {
    setLoading(true);
    try {
      const response = await startChat(recipientID);
      await refreshChats();
      return response;
    } catch (err: any) {
      setError(err.message || "Error creating chat");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const findChat = async (otherUserId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const axios = (await import("axios")).default;
      const response = await axios.get(`http://localhost:3000/api/chat/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || "Error finding chat");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteChatById = async (chatId: string) => {
    setLoading(true);
    try {
      const response = await deleteChat(chatId);
      await refreshChats();
      return response;
    } catch (err: any) {
      setError(err.message || "Error deleting chat");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createChat, findChat, refreshChats, deleteChatById, error, loading, chats };
};
