import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { BACKEND_URL } from '../utilities/contants';
import { myFetch } from '../utilities/utilities';

export interface Homework {
  name: string;
  id: number;
  subject: string;
  finishDate: Date;
  plannedDate: Date;
  description: string;
  duration: number;
  completed: boolean;
}

interface HomeworkState {
  homework: Homework[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

const initialState: HomeworkState = {
  homework: [],
  isLoading: false,
  hasError: false,
};

export const homeworkSlice = createSlice({
  name: 'homework',
  initialState,
  reducers: {
    setHomework(state, action: PayloadAction<Homework[]>) {
      state.homework = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      console.log(action.payload);
      state.hasError = true;
      state.errorMessage = action.payload;
    },
  },
});

export default homeworkSlice;

export const homeworkActions = homeworkSlice.actions;

export const fetchHomework = (token: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const homework = await myFetch(BACKEND_URL + '/homework/all', {
        headers: {
          Authorization: token as string,
        },
      });
      dispatch(homeworkActions.setHomework(homework));
    } catch (err) {
      const error = err as Error;
      dispatch(homeworkActions.setError(error.message));
    }
  };
};
