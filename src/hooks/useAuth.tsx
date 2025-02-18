// hooks/useAuth.tsx
import { useState, useContext } from "react";
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

  // Common helper used here with mapParticipants = true.
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
          const mappedParticipants = chat.participants.map((participant: any) => ({
            userID: participant.userID,
            username: participant.username,
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

  // Helper: refresh chats data.
  const refreshChats = async (): Promise<any[]> => {
    console.log("🔄 Starting refreshChats in useAuth");
    const chats = await fetchAndProcessChats(true); // map participants
    console.log("✅ Processed chats with messages:", chats);
    return chats;
  };

  // Refresh user session (called on page refresh)
  const refreshUserSession = async () => {
    console.log("🔄 Checking stored session on page refresh");
    const token = localStorage.getItem("token");
    console.log("📝 Stored token:", token ? "Found" : "Not found");

    if (token) {
      try {
        const storedUserID = localStorage.getItem("userID");
        console.log("👤 Stored userID:", storedUserID);
        if (!storedUserID) {
          console.error("❌ No userID found in localStorage");
          return null;
        }

        console.log("📡 Fetching user data after refresh");
        const [userData, friendRequests, friends] = await Promise.all([
          fetchUserData(storedUserID),
          retrieveFriendReq(),
          retrieveFriendList(),
        ]);
        console.log("📥 Fetched user data:", userData);
        console.log("👥 Fetched friends:", friends);
        console.log("📩 Fetched friend requests:", friendRequests);

        const chats = await refreshChats();
        console.log("💬 Fetched chats after refresh:", chats);

        const updatedUser: User = {
          username: userData.username,
          userID: storedUserID,
          friends: friends || [],
          friendRequests: friendRequests || [],
          chats: chats || [],
        };

        console.log("✅ Restoring user session with:", updatedUser);
        setUser(updatedUser);
        return updatedUser;
      } catch (err: any) {
        console.error("❌ Error restoring session:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        setError("Session expired or invalid");
        return null;
      }
    }
    return null;
  };

  // Login function
  const loginUser = async (username: string, password: string) => {
    console.log("🔑 Attempting login for user:", username);
    setLoading(true);
    try {
      const loginResponse = await login(username, password);
      console.log("📥 Login response:", loginResponse);

      if (loginResponse.token && loginResponse.user) {
        localStorage.setItem("token", loginResponse.token);
        localStorage.setItem("userID", loginResponse.user.userID);
        console.log("💾 Stored token and userID in localStorage");

        const userID = loginResponse.user.userID;
        console.log("👤 User ID:", userID);

        const [friendRequests, friends] = await Promise.all([
          retrieveFriendReq(),
          retrieveFriendList(),
        ]);
        console.log("👥 Retrieved friends:", friends);
        console.log("📩 Retrieved friend requests:", friendRequests);

        const chats = await refreshChats();
        console.log("💬 Processed chats:", chats);

        const updatedUser: User = {
          username: loginResponse.user.username,
          userID: userID,
          friends: friends || [],
          friendRequests: friendRequests || [],
          chats: chats || [],
        };
        console.log("✅ Setting user state with:", updatedUser);
        setUser(updatedUser);
        return updatedUser;
      } else {
        console.error("❌ Invalid login response");
        setError("Invalid credentials or server error");
        throw new Error("Login failed");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.message || "Error during login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registration function
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
