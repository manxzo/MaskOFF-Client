// [Client: useWebSocket.tsx]
// This hook sets up the WebSocket connection. When the server sends an "UPDATE_DATA"
// message (targeted to this user), the hook dispatches a custom event ("refreshData")
// so that other hooks/components can refresh their data.

import { useState, useEffect } from "react";

const useWebSocket = (userID: string | null) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!userID) return;

    // Determine the protocol: use "wss" if the page is loaded via HTTPS; otherwise, use "ws".

    // Instead of dynamically constructing using window.location.protocol,
    // directly use the secure URL:
    const network = import.meta.env.VITE_NETWORK_API_URL;
    const wsUrl = `wss://${network}`;
    const socket = new WebSocket(wsUrl);

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
          window.dispatchEvent(
            new CustomEvent("refreshData", { detail: data })
          );
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
      // Only close if already open
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userID]);

  return ws;
};

export default useWebSocket;
