import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  jwt?: string;
  username?: string;
  email?: string;
  userId?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        userId: string;
        username: string;
        email: string;
        jwt: string;
      }>
    ) {
      const { jwt, email, userId, username } = action.payload;
      state.isAuthenticated = true;
      state.jwt = jwt;
      state.email = email;
      state.userId = userId;
      state.username = username;
    },
  },
});

export default authSlice;

export const authActions = authSlice.actions;
