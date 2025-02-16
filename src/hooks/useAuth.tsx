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
    return chats;
  };

  // Login function
  const loginUser = async (username: string, password: string) => {
    setLoading(true);
    try {
      const loginResponse = await login(username, password);
      if (loginResponse.token && loginResponse.user) {
        const userID = loginResponse.user.userID;
        // Retrieve additional data concurrently:
        const [friendRequests, friends, chatsRaw] = await Promise.all([
          retrieveFriendReq(),
          retrieveFriendList(),
          retrieveChats(),
        ]);
        // Process chats to get decrypted messages and proper date formats.
        const chats = await refreshChats();

        // Build the complete user object.
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

  return { loginUser, registerUser, error, loading };
};
