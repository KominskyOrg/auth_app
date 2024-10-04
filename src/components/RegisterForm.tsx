// src/components/RegisterForm.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateName = (name: string): boolean => {
    const re = /^[a-zA-Z]+$/;
    return re.test(name);
  };

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return false;
    }

    if (!specialCharRegex.test(password)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before submitting
    setIsLoading(true); // Start loading

    // Client-side validations
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one special character."
      );
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      setIsLoading(false);
      return;
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      setError("Names can only contain letters.");
      setIsLoading(false);
      return;
    }

    try {
      await register(email, password, firstName, lastName, username);
      // Assuming registration was successful and navigates to login
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      console.error("Registration Error:", err);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="Enter your email"
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
          autoComplete="new-password"
          placeholder="Create a password"
        />
      </div>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoComplete="given-name"
          placeholder="Enter your first name"
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          autoComplete="family-name"
          placeholder="Enter your last name"
        />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          placeholder="Choose a username"
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
