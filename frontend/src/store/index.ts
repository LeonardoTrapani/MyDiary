import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
import initialAuthSlice from './initialAuth-slice';
import uiSlice from './ui-slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    initialAuth: initialAuthSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
