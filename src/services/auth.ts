import { setAuthToken } from "./api";

export const logout = () => {
  localStorage.removeItem("jwtToken");
  setAuthToken(null);
};
