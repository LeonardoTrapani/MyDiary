import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { BACKEND_URL } from '../utilities/contants';
import { CustomRequestInit } from '../utilities/hooks';

export interface freeDay {
  date: string;
  freeMinutes: number;
}
export interface plannedDate {
  date: string;
  minutes: number;
}
interface HomeworkCreating {
  name: string;
  subject: string;
  description: string;
  duration: number;
  expirationDate: string;
  plannedDates?: [plannedDate, ...plannedDate[]];
}
interface createHomeworkState {
  isLoading: boolean;
  freeDays: freeDay[];
  isChoosingFreeDay: boolean;
  homeworkCreating?: HomeworkCreating;
}

const initialState: createHomeworkState = {
  isLoading: false,
  isChoosingFreeDay: false,
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
      state.isChoosingFreeDay = true;
      state.homeworkCreating = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsChoosingFreeDay(state, action: PayloadAction<boolean>) {
      state.isChoosingFreeDay = action.payload;
    },
  },
});

export const searchFreeDays = (
  options: {
    expirationDateValue: string;
    durationValue: number;
    page: number;
  },
  fetchAuthorized: () => (
    url: string,
    options?: CustomRequestInit | undefined
  ) => Promise<freeDay[]>
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createHomeworkActions.setLoading(true));

      const res = await fetchAuthorized()(
        BACKEND_URL + '/homework/freeDays/' + options.page,
        {
          method: 'POST',
          requestBody: {
            expirationDate: options.expirationDateValue,
            duration: options.durationValue,
          },
        }
      );
      dispatch(createHomeworkActions.setFreeDays(res));
    } catch (err) {
      //TODO: handle err
    } finally {
      dispatch(createHomeworkActions.setLoading(false));
    }
  };
};

export default createHomeworkSlice;
export const createHomeworkActions = createHomeworkSlice.actions;
