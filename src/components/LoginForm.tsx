// src/components/LoginForm.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before submitting
    setIsLoading(true); // Start loading

    try {
      await login(username, password);
      // Assuming the token is handled in api.ts (stored in cookies or localStorage)
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed.");
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          placeholder="Enter your username"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
