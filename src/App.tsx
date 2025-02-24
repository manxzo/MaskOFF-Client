import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { EmailVerification } from "./pages/EmailVerification";
import { ResetPasswordForm } from "./pages/PasswordReset";
import FriendsPage from "./pages/Friends";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import Explore from "./pages/Explore";



const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/chat/:chatID?" element={<Chat />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/profile/:username?" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default App;
