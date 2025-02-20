import { useState, useEffect } from "react";

const useWebSocket = (userID: string | null) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!userID) return;
    const network = import.meta.env.VITE_NETWORK_API_URL;
    const wsUrl = `ws://${network}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(JSON.stringify({ type: "AUTH", userId: userID }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
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
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userID]);

  return ws;
};

export default useWebSocket;
