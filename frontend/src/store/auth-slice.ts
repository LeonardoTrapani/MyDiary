import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { myFetch } from '../utilities/utilities';
import { BACKEND_URL } from '../utilities/contants';
import { uiActions } from './ui-slice';

interface AuthState {
  userDetails?: {
    username: string;
    email: string;
    userId: string;
  };
  token?: string;
  isAuthenticated: boolean;
  loginError?: string;
  isLoginLoading: boolean;
  tokenLoginError: boolean;
  tokenLoginSuccess: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoginLoading: false,
  tokenLoginError: false,
  tokenLoginSuccess: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleLoading(state) {
      state.isLoginLoading = !state.isLoginLoading;
    },
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
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    authorizeByTokenSuccess(
      state,
      action: PayloadAction<{
        username: string;
        email: string;
        userId: string;
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.userDetails = action.payload;
      state.tokenLoginSuccess = true;
    },
    setTokenHasError(state, action: PayloadAction<boolean>) {
      state.tokenLoginError = action.payload;
    },
  },
});

export default authSlice;

export const authActions = authSlice.actions;

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(authActions.toggleLoading());
    try {
      const data = await myFetch(BACKEND_URL + '/login', {
        method: 'POST',
        requestBody: {
          email,
          password,
        },
      });
      localStorage.setItem('token', `bearer ${data.token}`);
      dispatch(authActions.login({ ...data }));
    } catch ({ message }) {
      dispatch(authActions.failedLogin({ errorMessage: message as string }));
    } finally {
      dispatch(authActions.toggleLoading());
    }
  };
};

export const authenticateByToken = (token: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(uiActions.toggleLoading());
    try {
      const user = await myFetch(BACKEND_URL + '/userInfo', {
        headers: {
          authorization: token,
        },
      });
      dispatch(authActions.authorizeByTokenSuccess({ ...user, token }));
    } catch (err) {
      dispatch(authActions.setTokenHasError(true));
    } finally {
      dispatch(uiActions.toggleLoading());
    }
  };
};
