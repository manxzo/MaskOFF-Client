// [Client: hooks/useFriends.tsx]
// This hook manages friend operations and friend state.
// It now listens for "refreshData" events (from the WebSocket) to automatically refresh friend data.

import { useState, useContext, useEffect } from "react";
import {
  sendFriendReq,
  retrieveFriendReq,
  acceptFriendReq,
  retrieveFriendList,
} from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";

export const useFriends = () => {
  // Global user config update function.
  const { setUser } = useContext(UserConfigContext)!;
  const network = import.meta.env.VITE_NETWORK_API_URL;
  // Local state for error, loading, and friend data.
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Helper: Refresh friend data by retrieving friend requests and friend list.
  // Updates both the global user config and the local friendState.
  const refreshFriends = async () => {
    try {
      const [friendRequests, friends] = await Promise.all([
        retrieveFriendReq(),
        retrieveFriendList(),
      ]);
      // Update global user config.
      setUser((prev) => ({
        ...prev,
        friends: friends || [],
        friendRequests: friendRequests || [],
      }));
    } catch (err: any) {
      setError(err.message || "Error refreshing friend data");
      throw err;
    }
  };

  // Send a friend request.
  const sendRequest = async (friendID: string) => {
    setLoading(true);
    try {
      const response = await sendFriendReq(friendID);
      await refreshFriends();
      return response;
    } catch (err: any) {
      setError(err.message || "Error sending friend request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Accept a friend request.
  const acceptRequest = async (friendID: string) => {
    setLoading(true);
    try {
      const response = await acceptFriendReq(friendID);
      await refreshFriends();
      return response;
    } catch (err: any) {
      setError(err.message || "Error accepting friend request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete (decline) a friend request.
  // Uses axios directly since it's not wrapped in services.
  const deleteFriendRequest = async (friendID: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const axios = (await import("axios")).default;
      const response = await axios.delete(
        `http://${network}/api/friends/request`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { friendID },
        }
      );
      await refreshFriends();
      return response.data;
    } catch (err: any) {
      setError(err.message || "Error deleting friend request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Listen for "refreshData" events from the WebSocket.
  // When the event's detail indicates an update for friends (or is unspecified),
  // refresh the friend data.
  useEffect(() => {
    const handleRefresh = (event: CustomEvent) => {
      if (!event.detail || event.detail.update === "friends") {
        refreshFriends();
      }
    };
    window.addEventListener("refreshData", handleRefresh as EventListener);
    return () => {
      window.removeEventListener("refreshData", handleRefresh as EventListener);
    };
  }, []);

  return {
    sendRequest,
    acceptRequest,
    deleteFriendRequest,
    refreshFriends,
    error,
    loading,
  };
};
