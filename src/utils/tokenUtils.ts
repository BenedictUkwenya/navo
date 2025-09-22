import { store } from "../redux/store";
import { logout } from "../redux/authSlice";

export const checkTokenExpiration = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    store.dispatch(logout());
    return false;
  }

  try {
    // Decode the JWT token
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token has expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token has expired, clear storage and dispatch logout
      store.dispatch(logout());
      return false;
    }
    return true;
  } catch (error) {
    // If there's any error in token parsing, dispatch logout
    store.dispatch(logout());
    return false;
  }
};

export const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp || null;
  } catch {
    return null;
  }
};
