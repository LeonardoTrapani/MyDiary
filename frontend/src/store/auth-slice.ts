import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  jwt?: string;
  username?: string;
  password?: string;
  userId?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate(
      state,
      action: PayloadAction<{
        userId: string;
        username: string;
        email: string;
        jwt: string;
      }>
    ) {
      state.isAuthenticated = !state.isAuthenticated;
    },
  },
});

export default authSlice;

export const authActions = authSlice.actions;
