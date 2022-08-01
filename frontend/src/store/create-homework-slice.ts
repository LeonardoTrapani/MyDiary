import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { BACKEND_URL } from '../utilities/contants';
import { CustomRequestInit } from '../utilities/hooks';
import { uiActions } from './ui-slice';

interface freeDay {
  date: string;
  freeMinutes: number;
}
interface HomeworkCreating {
  name: string;
  subject: string;
  description: string;
  duration: number;
  expirationDate: string;
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

export const addHomeworkAndSearchDays = (
  values: {
    expirationDateValue: string;
    durationValue: number;
    descriptionValue: string;
    nameValue: string;
    subjectValue: string;
  },
  fetchAuthorized: (
    url: string,
    options?: CustomRequestInit | undefined
  ) => Promise<freeDay[]>
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(uiActions.toggleModalOpened(true));
      dispatch(createHomeworkActions.setLoading(true));
      const res = await fetchAuthorized(BACKEND_URL + '/homework/freeDays/1', {
        method: 'POST',
        requestBody: {
          expirationDate: values.expirationDateValue,
          duration: values.durationValue,
        },
      });
      dispatch(createHomeworkActions.setFreeDays(res));
      dispatch(
        createHomeworkActions.setHomeworkCreating({
          description: values.descriptionValue,
          duration: values.durationValue,
          expirationDate: values.expirationDateValue,
          name: values.nameValue,
          subject: values.subjectValue,
        })
      );
    } catch (err) {
      //TODO: handle err
    } finally {
      dispatch(createHomeworkActions.setLoading(false));
    }
  };
};

export default createHomeworkSlice;
export const createHomeworkActions = createHomeworkSlice.actions;
