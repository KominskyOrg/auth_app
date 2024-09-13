import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/jwt";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("jwtToken");

  if (!isTokenValid(token)) {
    // Redirect to login page if the token is invalid or expired
    return <Navigate to="/login" />;
  }

  // Render the children components if the token is valid
  return children;
};

export default PrivateRoute;
