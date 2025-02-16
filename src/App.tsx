// src/App.tsx

import { Navigate, Route, Routes } from "react-router-dom";


// Import your pages (ensure you create/update these pages using @heroui/react components)
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { CreateUser } from "./pages/CreateUser";
import { Dashboard } from "./pages/Dashboard";
import { FindUsers } from "./pages/FindUsers";
import { Friends } from "./pages/Friends";
import { Messages } from "./pages/Messages";

function App() {
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
}

export default App;
