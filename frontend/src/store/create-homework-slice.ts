import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface freeDay {
  date: Date;
  freeMinutes: number;
}
interface HomeworkCreating {
  name: string;
  subject: string;
  description: string;
  duration: number;
  expirationDate: Date;
}
interface createHomeworkState {
  isLoading: boolean;
  freeDays: freeDay[];
  homeworkCreating?: HomeworkCreating;
}

const initialState: createHomeworkState = {
  isLoading: false,
  freeDays: [],
};
const createHomeworkSlice = createSlice({
  name: 'createHomework',
  initialState,
  reducers: {
    setFreeDays(state, action: PayloadAction<freeDay[]>) {
      state.freeDays = action.payload;
    },
    setHomeworkCreating(state, action: PayloadAction<HomeworkCreating>) {
      state.homeworkCreating = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export default createHomeworkSlice;
export const createHomeworkActions = createHomeworkSlice.actions;
