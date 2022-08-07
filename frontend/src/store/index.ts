import { configureStore } from '@reduxjs/toolkit';

import authSlice from './auth-slice';
import calendarSlice from './calendar-slice';
import createHomeworkSlice from './create-homework-slice';
import homeworkSlice from './homework-slice';
import uiSlice from './ui-slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    homework: homeworkSlice.reducer,
    createHomework: createHomeworkSlice.reducer,
    calendar: calendarSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
