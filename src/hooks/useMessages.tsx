// [Client: useMessages.tsx]
// This hook handles messaging operations (send, edit, delete, get messages)
// and refreshes chat data on updates. It also listens for "refreshData" events.
import { useState, useContext, useEffect } from "react";
import { sendMessage, editMessage, deleteMessage, retrieveChatMessages, retrieveChats } from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";

export const useMessages = () => {
  const { updateChats } = useContext(UserConfigContext)!;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Helper: fetch and process chats.
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
    } catch (err: any) {
      setError(err.message || "Error refreshing chats");
      throw err;
    }
  };

  // Listen for "refreshData" events.
  useEffect(() => {
    const handleRefresh = () => {
      refreshChats();
    };
    window.addEventListener("refreshData", handleRefresh as EventListener);
    return () => {
      window.removeEventListener("refreshData", handleRefresh as EventListener);
    };
  }, []);

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
