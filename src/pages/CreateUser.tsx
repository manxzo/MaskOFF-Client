import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@heroui/link";
import { useNavigate } from "react-router-dom";

export const CreateUser = () => {
  const { registerUser, error, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(username, password);
      navigate('/profile-onboarding/step1');
    } catch (err) {
      // handled by hook.
    }
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-md mx-auto">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            autoComplete="new-password"
          />
          {error && <p color="danger">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <p className="mt-4">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </DefaultLayout>
  );
};

export default CreateUser;
