import { useState } from "react";
import {
  listChats,
  sendMessage,
  getMessages,
  deleteChat,
  editMessage,
  updateJobChatSettings,
} from "@/services/services";

const useChats = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listChats();
      const chatsFromRes = res.data.chats || res.data;
      // Deduplicate chats by chatID
      const dedupedChats = Array.from(
        new Map(chatsFromRes.map((chat: any) => [chat.chatID, chat])).values()
      );
      setChats(dedupedChats);
      return dedupedChats;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error fetching chats"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectChatByID = async (chatID: string) => {
    setLoading(true);
    setError(null);
    try {
      const chat = chats.find((c) => c.chatID === chatID);
      if (chat) {
        setSelectedChat(chat);
        const res = await getMessages(chatID);
        setMessages(res.data.messages || res.data);
        return chat;
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Error fetching chat messages"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (
    payload: { chatID?: string; recipientID?: string; text: string; chatType?: string; jobID?: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendMessage(payload);
      const chatID = payload.chatID || res.data.chat.chatID;
      const updatedRes = await getMessages(chatID);
      setMessages(updatedRes.data.messages || updatedRes.data);
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Error sending message"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeChat = async (chatID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteChat(chatID);
      setChats((prev) => prev.filter((chat) => chat.chatID !== chatID));
      if (selectedChat?.chatID === chatID) {
        setSelectedChat(null);
        setMessages([]);
      }
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error deleting chat"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editChatMessage = async (
    chatID: string,
    messageID: string,
    newText: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await editMessage(chatID, messageID, newText);
      const updatedRes = await getMessages(chatID);
      setMessages(updatedRes.data.messages || updatedRes.data);
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error editing message"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJobSettings = async (
    chatID: string,
    updateData: { revealIdentity?: boolean; status?: string; offerPrice?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateJobChatSettings(chatID, updateData);
      if (selectedChat && selectedChat.chatID === chatID) {
        setSelectedChat(res.data.chat);
      }
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Error updating chat settings"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    chats,
    selectedChat,
    messages,
    loading,
    error,
    fetchChats,
    selectChatByID,
    sendChatMessage,
    removeChat,
    editChatMessage,
    updateJobSettings,
    setChats,
    setSelectedChat,
    setMessages,
    setError,
    setLoading,
  };
};

export default useChats;
