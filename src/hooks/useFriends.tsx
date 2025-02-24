import { useState, useContext } from "react";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/services/services";
import { GlobalConfigContext } from "@/config/GlobalConfig";

export const useFriends = () => {
  const globalContext = useContext(GlobalConfigContext);
  if (!globalContext) {
    throw new Error("useFriends must be used within a GlobalConfigProvider");
  }
  const {
    error,
    setError,
  } = globalContext;
  const [loading, setLoading] = useState<boolean>(false);

  const sendRequest = async (friendID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendFriendRequest(friendID);
      // optionally, you can re-fetch friend requests after sending one.
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Send friend request failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };




  const acceptRequest = async (friendID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await acceptFriendRequest(friendID);
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Accept friend request failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (friendID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await rejectFriendRequest(friendID);
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Reject friend request failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };



  return {
    loading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
  };
};

export default useFriends;
