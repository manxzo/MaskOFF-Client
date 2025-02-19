import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@heroui/link";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { loginUser, error, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      alert("Login successful");
      setUsername("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-md mx-auto">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {error && <p color="danger">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4">
          Don't have an account? <Link href="/newuser">Create one</Link>
        </p>
      </div>
    </DefaultLayout>
  );
};

export default Login;
