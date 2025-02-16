// hooks/useWebSocket.tsx
import { useState, useEffect } from "react";

const useWebSocket = (userID: string | null) => {
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
      // Extend this logic to update global state as needed.
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [userID]);

  return ws;
};

export default useWebSocket;
