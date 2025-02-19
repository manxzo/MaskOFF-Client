// src/App.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// Import your pages (ensure you create/update these pages using @heroui/react components)
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { CreateUser } from "./pages/CreateUser";
import { Dashboard } from "./pages/Dashboard";
import { FindUsers } from "./pages/FindUsers";
import { Friends } from "./pages/Friends";
import { Messages } from "./pages/Messages";

const App = () => {
  const { refreshUserSession } = useAuth();

  useEffect(() => {
    console.log("🔄 App mounted - checking session");
    const initializeSession = async () => {
      try {
        const restoredSession = await refreshUserSession();
        console.log(
          "📥 Session restoration result:",
          restoredSession ? "Success" : "No session"
        );
      } catch (err) {
        console.error("❌ Error initializing session:", err);
      }
    };

    initializeSession();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route element={<Home />} path="/home" />
      <Route element={<Login />} path="/login" />
      <Route element={<CreateUser />} path="/newuser" />
      <Route element={<Dashboard />} path="/dashboard" />
      <Route element={<FindUsers />} path="/find-users" />
      <Route element={<Friends />} path="/friends" />
      <Route element={<Messages />} path="/messages" />
      {/* You can add additional routes as needed */}
    </Routes>
  );
};

export default App;
