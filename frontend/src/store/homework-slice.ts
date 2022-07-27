import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { BACKEND_URL } from '../utilities/contants';
import { myFetch } from '../utilities/utilities';

interface Homework {
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
  },
});

export default homeworkSlice;

export const homeworkActions = homeworkSlice.actions;

export const fetchHomework = (token: string) => {
  return async (dispatch: Dispatch) => {
    const homework = await myFetch(BACKEND_URL + '/homework/all', {
      headers: {
        Authorization: token as string,
      },
    });
    dispatch(homeworkActions.setHomework(homework));
  };
};
