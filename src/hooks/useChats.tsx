// hooks/useChat.tsx
import { useState, useContext } from "react";
import { startChat, retrieveChats, deleteChat, retrieveChatMessages } from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";

export const useChat = () => {
  const { updateChats } = useContext(UserConfigContext)!;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chats,setChats] = useState([]);
  // Helper: refresh chats data.
  const refreshChats = async () => {
    console.log("🔄 Starting refreshChats in useChats");
    try {
      const chatsRaw = await retrieveChats();
      console.log("📥 Retrieved raw chats:", chatsRaw);
      
      const chats = await Promise.all(
        (chatsRaw || []).map(async (chat: any) => {
          const chatId = chat.chatID;
          const messages = await retrieveChatMessages(chatId);
          console.log(`📨 Retrieved messages for chat ${chatId}:`, messages);
          
          const mappedMessages = (messages || []).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          return { 
            ...chat, 
            createdAt: new Date(chat.createdAt), 
            updatedAt: new Date(chat.updatedAt), 
            messages: mappedMessages 
          };
        })
      );
      console.log("✅ Updated chats state with:", chats);
      updateChats(chats);
      setChats(chats);
    } catch (err: any) {
      console.error("❌ Error in refreshChats:", err);
      setError(err.message || "Error refreshing chats");
      throw err;
    }
  };

  // Create (or start) a new chat.
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

  // Find an existing chat with a specific user.
  // (This example uses axios directly since it wasn't wrapped in services.)
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

  // Delete an entire chat.
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

  return { createChat, findChat, refreshChats, deleteChatById, error, loading,chats };
};
