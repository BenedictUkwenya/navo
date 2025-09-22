import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  tokenExpiration: number | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  tokenExpiration: localStorage.getItem("tokenExpiration")
    ? Number(localStorage.getItem("tokenExpiration"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
        exp: number;
      }>
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.tokenExpiration = action.payload.exp;

      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("tokenExpiration", action.payload.exp.toString());
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.tokenExpiration = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiration");
    },
    refreshAccessToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        exp: number;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.tokenExpiration = action.payload.exp;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("tokenExpiration", action.payload.exp.toString());
    },
  },
});

export const { login, logout, refreshAccessToken } = authSlice.actions;
export default authSlice.reducer;
