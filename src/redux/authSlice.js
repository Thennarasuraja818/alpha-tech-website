import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("userToken") || null, // Load token from localStorage
  },
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;

      // Store token in localStorage
      localStorage.setItem("userToken", token);

      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      // Remove token from localStorage
      localStorage.removeItem("userToken");

      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;