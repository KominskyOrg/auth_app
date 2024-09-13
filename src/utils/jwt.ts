import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user_id: string;
  exp: number;
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.log("Error: " + error);
    return false;
  }
};
