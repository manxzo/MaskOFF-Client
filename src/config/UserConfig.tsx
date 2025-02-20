import React, { createContext, useState, useEffect, ReactNode } from "react";

//!! IMPORTANT: STORE ALL INTERFACE HERE GLOBALLY EXPORT
export interface Message {
  messageID: string;
  sender: string;
  recipient: string;
  message: string;
  timestamp: Date;
}

export interface Participant {
  userID: string;
  username: string;
}

export interface Chat {
  chatID: string;
  participants: Participant[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Friend {
  userID: string;
  username: string;
}

export interface User {
  username: string;
  userID: string;
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  privacy?: {
    profileVisibility: string;
    messagingPreference: string;
    friendRequestSetting: string;
  };
  friends: Friend[];
  friendRequests: Friend[];
  chats: Chat[];
}

export interface UserConfigType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateChats: (chats: Chat[]) => void;
}

export const UserConfigContext = createContext<UserConfigType | undefined>(
  undefined
);
const network = import.meta.env.VITE_NETWORK_API_URL;
async function fetchUpdatedUserData(): Promise<User> {
  const userID = localStorage.getItem("userID");
  if (!userID) {
    throw new Error("No userID stored");
  }
  const response = await fetch(`http://${network}/api/user/${userID}`);
  if (!response.ok) {
    throw new Error("Failed to fetch updated user data");
  }
  const data = await response.json();
  return data;
}

export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    username: "",
    userID: "",
    friends: [],
    friendRequests: [],
    chats: [],
  });

  const updateChats = (newChats: Chat[]): void => {
    setUser((prevUser) => ({ ...prevUser, chats: newChats }));
  };

  useEffect(() => {
    const handleRefresh = async (event: CustomEvent) => {
      console.log("Received refreshUserConfig event", event.detail);
      try {
        const updatedUser = await fetchUpdatedUserData();
        setUser(updatedUser);
      } catch (error) {
        console.error("Error refreshing user config:", error);
      }
    };
    window.addEventListener(
      "refreshUserConfig",
      handleRefresh as EventListener
    );
    return () => {
      window.removeEventListener(
        "refreshUserConfig",
        handleRefresh as EventListener
      );
    };
  }, []);

  return (
    <UserConfigContext.Provider value={{ user, setUser, updateChats }}>
      {children}
    </UserConfigContext.Provider>
  );
};

/* 
Usage Example:

import React, { useContext } from "react";
import { UserConfigContext } from "@/config/UserConfig";

const SomeComponent = () => {
  const userConfig = useContext(UserConfigContext);
  if (!userConfig) {
    throw new Error("UserConfigContext is not available");
  }
  const { user, updateChats } = userConfig;

  // Now you can access the user, userID, friends, chats, etc.
  // And call updateChats with an array of Chat objects.
  
  return <div>Welcome, {user.username}</div>;
};

export default SomeComponent;
*/
