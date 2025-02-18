// hooks/useFriends.tsx
import { useState, useContext } from "react";
import {
  sendFriendReq,
  retrieveFriendReq,
  acceptFriendReq,
  retrieveFriendList,
} from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";

export const useFriends = () => {
  const { setUser } = useContext(UserConfigContext)!;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [friendState,setFriendState] = useState({friends:[],friendRequests:[],sentFriendRequests:[]})
  // Refresh friend data and update the global user config.
  const refreshFriends = async () => {
    try {
      const [friendRequests, friends] = await Promise.all([
        retrieveFriendReq(),
        retrieveFriendList(),
      ]);
      setUser((prev) => ({
        ...prev,
        friends: friends || [],
        friendRequests: friendRequests || [],
      }));
      setFriendState((prev)=>({...prev,friends:friends||[],friendRequests:friendRequests||[]}));
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

  // Delete a friend request.
  // (This example uses axios directly since it wasn’t wrapped in services.)
  const deleteFriendRequest = async (friendID: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const axios = (await import("axios")).default;
      const response = await axios.delete(`http://localhost:3000/api/friends/request`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { friendID },
      });
      await refreshFriends();
      return response.data;
    } catch (err: any) {
      setError(err.message || "Error deleting friend request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, acceptRequest, deleteFriendRequest, refreshFriends, error, loading,friendState };
};
