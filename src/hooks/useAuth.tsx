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

  // Helper: refresh chats data by retrieving chats and their messages.
  const refreshChats = async (): Promise<any[]> => {
    console.log("🔄 Starting refreshChats in useAuth");
    const chatsRaw = await retrieveChats();
    console.log("📥 Retrieved raw chats:", chatsRaw);
    
    const chats = await Promise.all(
      (chatsRaw || []).map(async (chat: any) => {
        const chatId = chat.chatID;
        const messages = await retrieveChatMessages(chatId);
        console.log(`📨 Retrieved messages for chat ${chatId}:`, messages);
        
        const mappedParticipants = chat.participants.map((participant) => ({userID:participant.userID,username:participant.username}));
        const mappedMessages = (messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        return { 
          ...chat, 
          createdAt: new Date(chat.createdAt), 
          updatedAt: new Date(chat.updatedAt), 
          messages: mappedMessages,
          participants: mappedParticipants
        };
      })
    );
    console.log("✅ Processed chats with messages:", chats);
    return chats;
  };

  // Add a new function to handle page refresh authentication
  const refreshUserSession = async () => {
    console.log("🔄 Checking stored session on page refresh");
    const token = localStorage.getItem("token");
    console.log("📝 Stored token:", token ? "Found" : "Not found");
    
    if (token) {
      try {
        // Get the stored user ID if available
        const storedUserID = localStorage.getItem("userID");
        console.log("👤 Stored userID:", storedUserID);
        
        if (!storedUserID) {
          console.error("❌ No userID found in localStorage");
          return null;
        }

        // Fetch all necessary user data
        console.log("📡 Fetching user data after refresh");
        const [userData, friendRequests, friends] = await Promise.all([
          fetchUserData(storedUserID),
          retrieveFriendReq(),
          retrieveFriendList(),
        ]);
        
        console.log("📥 Fetched user data:", userData);
        console.log("👥 Fetched friends:", friends);
        console.log("📩 Fetched friend requests:", friendRequests);

        // Get chats and messages
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
        // Store necessary data in localStorage
        localStorage.setItem("token", loginResponse.token);
        localStorage.setItem("userID", loginResponse.user.userID);
        console.log("💾 Stored token and userID in localStorage");

        const userID = loginResponse.user.userID;
        console.log("👤 User ID:", userID);
        
        const [friendRequests, friends, chatsRaw] = await Promise.all([
          retrieveFriendReq(),
          retrieveFriendList(),
          retrieveChats(),
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
        // Optionally, retrieve complete user data:
        const userData = await fetchUserData(userID);
        setUser(userData);
        // Temporarily, shawn 
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

  return { 
    loginUser, 
    registerUser, 
    refreshUserSession,
    error, 
    loading 
  };
};
