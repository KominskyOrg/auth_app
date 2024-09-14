import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";


const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateName = (name: string) => {
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
    const navigate = useNavigate();
    
    e.preventDefault();

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one special character.');
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      setError("Names can only contain letters");
      return;
    }

    try {
      await register(email, password, firstName, lastName, username);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setError("Registration failed: " + err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
