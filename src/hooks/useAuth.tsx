// [Client: useAuth.tsx]
// This hook handles authentication and session restoration. It now includes a helper
// to refresh chats (with mapped participants) and listens for WebSocket-driven refresh events.
// When a "refreshData" event occurs, you can choose to refresh the entire user session 
// (or parts of it, such as chats and friends) via API calls.

import { useState, useContext, useEffect } from "react";
import {
  login,
  createUser,
  retrieveFriendReq,
  retrieveFriendList,
  retrieveChats,
  retrieveChatMessages,
  fetchUserData,
} from "@/services/services";
import { UserConfigContext, User } from "@/config/UserConfig";

export const useAuth = () => {
  const { setUser } = useContext(UserConfigContext)!;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Helper to fetch and process chats with participant mapping.
  const fetchAndProcessChats = async (mapParticipants: boolean = false) => {
    const chatsRaw = await retrieveChats();
    const chats = await Promise.all(
      (chatsRaw || []).map(async (chat: any) => {
        const messages = await retrieveChatMessages(chat.chatID);
        const mappedMessages = (messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        if (mapParticipants) {
          const mappedParticipants = chat.participants.map((p: any) => ({
            userID: p.userID,
            username: p.username,
          }));
          return {
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
            messages: mappedMessages,
            participants: mappedParticipants,
          };
        }
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

  const refreshChats = async (): Promise<any[]> => {
    console.log("🔄 Starting refreshChats in useAuth");
    const chats = await fetchAndProcessChats(true);
    console.log("✅ Processed chats with messages:", chats);
    return chats;
  };

  // Listen for refreshData events to update the session (if desired)
  useEffect(() => {
    const handleRefresh = async (event: CustomEvent) => {
      // You might check event.detail.update to decide what to refresh.
      // For a full refresh:
      console.log("Received refreshData event in useAuth", event.detail);
      try {
        const storedUserID = localStorage.getItem("userID");
        if (!storedUserID) return;
        const [userData, friendRequests, friends] = await Promise.all([
          fetchUserData(storedUserID),
          retrieveFriendReq(),
          retrieveFriendList(),
        ]);
        const chats = await refreshChats();
        const updatedUser: User = {
          username: userData.username,
          userID: storedUserID,
          friends: friends || [],
          friendRequests: friendRequests || [],
          chats: chats || [],
        };
        setUser(updatedUser);
      } catch (err: any) {
        console.error("Error refreshing user session:", err);
      }
    };
    window.addEventListener("refreshData", handleRefresh as EventListener);
    return () => {
      window.removeEventListener("refreshData", handleRefresh as EventListener);
    };
  }, [setUser]);

  const refreshUserSession = async () => {
    console.log("🔄 Checking stored session on page refresh");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const storedUserID = localStorage.getItem("userID");
        if (!storedUserID) return null;
        const [userData, friendRequests, friends] = await Promise.all([
          fetchUserData(storedUserID),
          retrieveFriendReq(),
          retrieveFriendList(),
        ]);
        const chats = await refreshChats();
        const updatedUser: User = {
          username: userData.username,
          userID: storedUserID,
          friends: friends || [],
          friendRequests: friendRequests || [],
          chats: chats || [],
        };
        setUser(updatedUser);
        return updatedUser;
      } catch (err: any) {
        console.error("Error restoring session:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        setError("Session expired or invalid");
        return null;
      }
    }
    return null;
  };

  const loginUser = async (username: string, password: string) => {
    setLoading(true);
    try {
      const loginResponse = await login(username, password);
      if (loginResponse.token && loginResponse.user) {
        localStorage.setItem("token", loginResponse.token);
        localStorage.setItem("userID", loginResponse.user.userID);
        const userID = loginResponse.user.userID;
        const [friendRequests, friends] = await Promise.all([
          retrieveFriendReq(),
          retrieveFriendList(),
        ]);
        const chats = await refreshChats();
        const updatedUser: User = {
          username: loginResponse.user.username,
          userID: userID,
          friends: friends || [],
          friendRequests: friendRequests || [],
          chats: chats || [],
        };
        setUser(updatedUser);
        return updatedUser;
      } else {
        setError("Invalid credentials or server error");
        throw new Error("Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Error during login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (username: string, password: string) => {
    setLoading(true);
    try {
      const registerResponse = await createUser({ username, password });
      if (registerResponse.token && registerResponse.user) {
        const userID = registerResponse.user.userID;
        const userData = await fetchUserData(userID);
        setUser(userData);
        setError("");
        alert("Account created successfully!");
        return userData;
      } else {
        setError("Registration failed");
        throw new Error("Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Error during registration");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, registerUser, refreshUserSession, error, loading };
};
