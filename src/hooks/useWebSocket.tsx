// hooks/useWebSocket.tsx
import { useState, useEffect, useContext } from "react";
import { UserConfigContext } from "@/config/UserConfig";

const useWebSocket = (userID: string | null) => {
  const userConfig = useContext(UserConfigContext);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!userID) return;

    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("WebSocket connected");
      // Authenticate with the WebSocket server.
      socket.send(JSON.stringify({ type: "AUTH", userId: userID }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      // Make sure the context is available before updating state.
      if (!userConfig) return;

      // Handle different message types from the server.
      switch (data.type) {
        case "NEW_MESSAGE": {
          // Create a new message object.
          const newMessage={
            messageID: data.messageID || "", // assuming server provides a messageID
            sender: data.sender,
            recipient: userID, // adjust logic if needed
            message: data.text,
            timestamp: new Date(), // or use data.timestamp if provided
          };

          // Update the corresponding chat with the new message.
          const updatedChats = userConfig.user.chats.map((chat) => {
            if (chat.chatID === data.chatID) {
              return { ...chat, messages: [...chat.messages, newMessage] };
            }
            return chat;
          });

          userConfig.updateChats(updatedChats);
          break;
        }
        case "DELETE_MESSAGE": {
          const updatedChats = userConfig.user.chats.map((chat) => {
            if (chat.chatID === data.chatID) {
              return {
                ...chat,
                messages: chat.messages.filter(
                  (msg) => msg.messageID !== data.messageID
                ),
              };
            }
            return chat;
          });
          userConfig.updateChats(updatedChats);
          break;
        }
        case "EDIT_MESSAGE": {
          const updatedChats = userConfig.user.chats.map((chat) => {
            if (chat.chatID === data.chatID) {
              return {
                ...chat,
                messages: chat.messages.map((msg) => {
                  if (msg.messageID === data.messageID) {
                    return { ...msg, message: data.newText };
                  }
                  return msg;
                }),
              };
            }
            return chat;
          });
          userConfig.updateChats(updatedChats);
          break;
        }
        default:
          // Handle other message types if needed.
          break;
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [userID, userConfig]);

  return ws;
};

export default useWebSocket;
