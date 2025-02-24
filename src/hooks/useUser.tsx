import { useState, useContext } from "react";
import {
  registerUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  loginUser,
  getUser,
  updateProfile,
  logout,
} from "@/services/services";
import { GlobalConfigContext } from "@/config/GlobalConfig";

export const useUser = () => {
  const globalContext = useContext(GlobalConfigContext);
  if (!globalContext) {
    throw new Error("useUser must be used within a GlobalConfigProvider");
  }
  const {
    setUser,
    error,
    setError,
    user,
    setChats,
  } = globalContext;
  const [loading, setLoading] = useState<boolean>(false);

  const register = async (data: {
    name: string;
    dob: Date;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    anonymousIdentity: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(data);
      // registration doesnt auto-login; ownself decide to update state if need
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Registration failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyUserEmail = async (userID: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyEmail(userID, token);
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Verification failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPwd = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await forgotPassword(email);
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Forgot password failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPwd = async (data: {
    userID: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await resetPassword(data);
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Reset password failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(username, password);
      localStorage.setItem("token", res.data.token);
      const userData = res.data.user;
      setUser(userData);
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Login failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (userID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUser(userID);
      const userData = res.data;
      setUser(userData);
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Fetch user failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userID: string, data: { publicInfo?: any; anonymousInfo?: any }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateProfile(userID, data);
      const updatedUser = { ...user, profile: res.data.profile };
      setUser(updatedUser);
      return res.data;
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Profile update failed";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setChats([])
  };

  return {
    loading,
    error,
    register,
    verifyUserEmail,
    forgotPwd,
    resetPwd,
    login,
    fetchUser,
    updateUserProfile,
    logout: logoutUser,
  };
};

export default useUser;
