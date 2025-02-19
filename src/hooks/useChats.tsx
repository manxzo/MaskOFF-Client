// [Client: useChat.tsx]
// This hook manages chat-related operations (create, delete, find, etc.).
// It listens for the "refreshData" event to update its local chats.
import { useState, useContext, useEffect } from "react";
import {
  startChat,
  deleteChat,
  retrieveChats,
  retrieveChatMessages,
} from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";

export const useChat = () => {
  const { updateChats } = useContext(UserConfigContext)!;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<any[]>([]);
  const network = import.meta.env.VITE_NETWORK_API_URL;
  // Helper: fetch and process chats (without extra participant mapping).
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
    try {
      const chats = await fetchAndProcessChats();
      updateChats(chats);
      setChats(chats);
    } catch (err: any) {
      setError(err.message || "Error refreshing chats");
      throw err;
    }
  };

  // Listen for "refreshData" events to refresh chats automatically.
  useEffect(() => {
    const handleRefresh = () => {
      refreshChats();
    };
    window.addEventListener("refreshData", handleRefresh as EventListener);
    return () => {
      window.removeEventListener("refreshData", handleRefresh as EventListener);
    };
  }, []);

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
      const response = await axios.get(
        `http://${network}/api/chat/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  return {
    createChat,
    findChat,
    refreshChats,
    deleteChatById,
    error,
    loading,
    chats,
  };
};
