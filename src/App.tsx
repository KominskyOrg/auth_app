import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <h1>Auth App</h1>
        <Routes>
          <Route
            path="/login"
            element={<LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />}
          />
          <Route
            path="/"
            element={isLoggedIn ? <p>You are logged in!</p> : <HomePage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
