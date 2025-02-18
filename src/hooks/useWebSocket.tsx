// [Client: useWebSocket.tsx]
// This hook sets up the WebSocket connection. When the server sends an "UPDATE_DATA"
// message (targeted to this user), the hook dispatches a custom event ("refreshData")
// so that other hooks/components can refresh their data.

import { useState, useEffect } from "react";

const useWebSocket = (userID: string | null) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!userID) return;

    // Connect to the WebSocket server (adjust URL/port as needed)
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("WebSocket connected");
      // Authenticate with the server by sending the user ID.
      socket.send(JSON.stringify({ type: "AUTH", userId: userID }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        // When an update is received, dispatch a custom event so that refresh functions run.
        if (data.type === "UPDATE_DATA") {
          window.dispatchEvent(new CustomEvent("refreshData", { detail: data }));
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
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
