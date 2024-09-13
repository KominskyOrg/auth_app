import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleRegisterClick}>Register</button>
    </div>
  );
}

export default HomePage;
