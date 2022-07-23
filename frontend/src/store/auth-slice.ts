import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { myFetch } from '../utilities';
import { BACKEND_URL } from '../contants';

interface AuthState {
  userDetails?: {
    token: string;
    username: string;
    email: string;
    userId: string;
  };
  isAuthenticated: boolean;
  loginError?: string;
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
        token: string;
      }>
    ) {
      const { token, email, userId, username } = action.payload;
      const userDetails = {
        token,
        email,
        userId,
        username,
      };
      state.isAuthenticated = true;
      state.loginError = undefined;
      state.userDetails = userDetails;
    },
    failedLogin(
      state,
      action: PayloadAction<{
        errorMessage: string;
      }>
    ) {
      state.loginError = action.payload.errorMessage;
    },
  },
});

export default authSlice;

export const authActions = authSlice.actions;

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const data = await myFetch(BACKEND_URL + '/login', {
        method: 'POST',
        requestBody: {
          email,
          password,
        },
      });
      dispatch(authActions.login({ ...data }));
    } catch ({ message }) {
      dispatch(authActions.failedLogin({ errorMessage: message as string }));
    }
  };
};
