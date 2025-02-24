import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getUser, listChats } from "@/services/services";
import { jwtDecode } from "jwt-decode";

export interface PublicProfile {
  userID: string;
  username: string;
  name: string;
  profile: {
    publicInfo?: {
      bio: string;
      skills: string[];
      achievements: string[];
      portfolio: string;
    };
  };
}

export interface Friend {
  userID: string;
  username: string;
  avatar: string;
  name: string;
}

export interface UserProfile {
  profileID: string;
  user: string;
  privacy: boolean;
  publicInfo: {
    bio: string;
    skills: string[];
    achievements: string[];
    portfolio: string;
  };
  anonymousInfo: {
    anonymousIdentity: string;
    details: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  userID: string;
  name: string;
  dob: Date;
  email: string;
  username: string;
  emailVerified: boolean;
  avatar?: string;
  friendRequestsSent: Friend[];
  friendRequestsReceived: Friend[];
  friends: Friend[];
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

export interface Message {
  msgID: string;
  sender: string;
  recipient: string;
  message: string;
  timestamp: string;
}

export interface Chat {
  chatID: string;
  participants: Friend[];
  messages: Message[];
}

export interface GlobalConfigContextType {
  user: User | null;
  chats: Chat[];
  error: string | null;
  refresh:boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setChats: React.Dispatch<React.SetStateAction<Chat[] | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalConfigContext = createContext<GlobalConfigContextType | undefined>(undefined);

interface JwtPayload {
  id: string;
  username: string;
  exp: number;
}

export const GlobalConfigProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refresh,setRefresh] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          return;
        }
        getUser(decoded.id)
          .then((res) => {
            setUser(res.data);
          })
          .catch((err) => {
            console.error("Error reloading:", err);
            localStorage.removeItem("token");
          });
      } catch (err) {
        console.error("Error decoding token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`ws://${import.meta.env.VITE_APP_SERVER_URL}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      // Authenticate the connection with the logged in user ID
      ws.send(JSON.stringify({ type: "AUTH", userID: user.userID }));
    };

    ws.onmessage = async (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        if (data.type === "UPDATE_DATA") {
          switch (data.update) {
            case "user": {
              const res = await getUser(user.userID);
              setUser(res.data);
              break;
            }
            case "chats": {
              const res = await listChats();
              const chatsFromRes: Chat[] = res.data.chats || res.data;
              const dedupedChats: Chat[] = Array.from(
                new Map(chatsFromRes.map((chat: any) => [chat.chatID, chat])).values()
              );
              setChats(dedupedChats);
              break;
            }
            case "refresh":{
              setRefresh(!refresh)
              break;
            }
            default:
              console.warn("Unknown update type:", data.update);
          }
        }
      } catch (error) {
        console.error("Error handling websocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [user]);

  const contextValue: GlobalConfigContextType = {
    user,
    chats,
    error,
    setUser,
    setChats,
    setError,
    refresh,
    setRefresh
  };

  return (
    <GlobalConfigContext.Provider value={contextValue}>
      {children}
    </GlobalConfigContext.Provider>
  );
};
