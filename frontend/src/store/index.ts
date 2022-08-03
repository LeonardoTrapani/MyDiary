import { configureStore } from '@reduxjs/toolkit';

import authSlice from './auth-slice';
import createHomeworkSlice from './create-homework-slice';
import homeworkSlice from './homework-slice';
import uiSlice from './ui-slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    homework: homeworkSlice.reducer,
    createHomework: createHomeworkSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
