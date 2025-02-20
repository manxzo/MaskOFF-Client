import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { CreateUser } from "./pages/CreateUser";
import { Dashboard } from "./pages/Dashboard";
import { FindUsers } from "./pages/FindUsers";
import { Friends } from "./pages/Friends";
import { Messages } from "./pages/Messages";
import ProfileOnboardingStep1 from "./pages/ProfileOnboarding/ProfileOnboardingStep1";
import ProfileOnboardingStep2 from "./pages/ProfileOnboarding/ProfileOnboardingStep2";
import ProfileOnboardingStep3 from "./pages/ProfileOnboarding/ProfileOnboardingStep3";
import ProfileOnboardingStep4 from "./pages/ProfileOnboarding/ProfileOnboardingStep4";
import Profile from "./pages/ProfileOnboarding/Profile";
import ProfileEdit from "./pages/ProfileOnboarding/ProfileEdit";

const App = () => {
  const { refreshUserSession } = useAuth();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const restoredSession = await refreshUserSession();
        console.log(
          "Session restoration result:",
          restoredSession ? "Success" : "No session"
        );
      } catch (err) {
        console.error("Error initializing session:", err);
      }
    };

    initializeSession();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/newuser" element={<CreateUser />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/find-users" element={<FindUsers />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/messages" element={<Messages />} />

      {/* Onboarding Routes */}
      <Route path="/profile-onboarding/step1" element={<ProfileOnboardingStep1 />} />
      <Route path="/profile-onboarding/step2" element={<ProfileOnboardingStep2 />} />
      <Route path="/profile-onboarding/step3" element={<ProfileOnboardingStep3 />} />
      <Route path="/profile-onboarding/step4" element={<ProfileOnboardingStep4 />} />

      {/* Profile Page */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />
      
      {/* Add additional routes if need */}
    </Routes>
  );
};

export default App;
