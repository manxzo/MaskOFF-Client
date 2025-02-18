// hooks/useWebSocket.tsx
import { useState, useEffect, useContext } from "react";
import { UserConfigContext } from "@/config/UserConfig";
import { useChat } from "./useChats";
import { useFriends } from "./useFriends";
const useWebSocket = (userID: string | null) => {
  const userConfig = useContext(UserConfigContext);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const {refreshChats} = useChat();
  const {refreshFriends}=useFriends();
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
        case "MESSAGE": {
          refreshChats();
          break;
        }
        case "FRIENDS":{
          refreshFriends();
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
