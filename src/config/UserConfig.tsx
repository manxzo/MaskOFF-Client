import React, { createContext, useState, ReactNode } from "react";

// Define the Message interface matching server response keys.
export interface Message {
  messageID: string;
  sender: string;
  recipient: string;
  message: string; // This holds the message text.
  timestamp: Date;
}
export interface Participant{
  userID:string;
  username:string;
}
// Define the Chat interface matching server response keys.
export interface Chat {
  chatID: string;
  participants: Participant[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}   

// Define the Friend interface matching server response keys.
export interface Friend {
  userID: string;
  username: string;
}

// Define the User interface matching server response keys.
export interface User {
  username: string;
  userID: string;
  friends: Friend[];
  friendRequests: Friend[];
  chats: Chat[];
}

// Define the context type with the proper function signatures.
export interface UserConfigType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateChats: (chats: Chat[]) => void;
}

// Create the context with an initial value of undefined.
export const UserConfigContext = createContext<UserConfigType | undefined>(undefined);

// Create the provider component.
export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    username: "",
    userID: "",
    friends: [],
    friendRequests: [],
    chats: [],
  });

  // Function to update the chats array in the user object.
  const updateChats = (newChats: Chat[]): void => {
    setUser((prevUser) => ({ ...prevUser, chats: newChats }));
  };

  return (
    <UserConfigContext.Provider value={{ user, setUser, updateChats }}>
      {children}
    </UserConfigContext.Provider>
  );
};

/* 
Usage Example:

import React, { useContext } from "react";
import { UserConfigContext } from "@/config/userConfig";

const SomeComponent = () => {
  const userConfig = useContext(UserConfigContext);
  if (!userConfig) {
    throw new Error("UserConfigContext is not available");
  }
  const { user, updateChats } = userConfig;

  // Now you can access the user, userID, friends, etc.
  // And call updateChats with an array of Chat objects.
  
  return <div>Welcome, {user.username}</div>;
};

export default SomeComponent;
*/
