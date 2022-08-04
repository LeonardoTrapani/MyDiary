import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { BACKEND_URL } from '../utilities/contants';
import { CustomRequestInit } from '../utilities/hooks';
import { formatDateToString } from '../utilities/utilities';

export interface freeDay {
  date: string;
  freeMinutes: number;
  assignedTime: number;
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
  timeToAssign: number;
  isAllTimeAssigned: false;
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
    assignedTimeChange(
      state,
      action: PayloadAction<{
        assignedTime: number;
        freeDay: freeDay;
      }>
    ) {
      if (!state.homeworkCreating) {
        return;
      }
      const freeDayIndex = state.freeDays.findIndex(
        (freeDay) =>
          formatDateToString(action.payload.freeDay.date) ===
          formatDateToString(freeDay.date)
      );
      if (freeDayIndex === -1) {
        console.error("can't find day");
        return;
      }
      const previousAssignedTime = state.freeDays[freeDayIndex].assignedTime;
      const assignedTimeDifference =
        action.payload.assignedTime - previousAssignedTime;
      let timeToAssign =
        state.homeworkCreating.timeToAssign - assignedTimeDifference;

      if (timeToAssign < 0) {
        action.payload.assignedTime += timeToAssign;
        timeToAssign = 0;
      }
      state.homeworkCreating.timeToAssign = timeToAssign;

      if (freeDayIndex === -1) {
        return console.error('free day not found');
      }

      state.freeDays[freeDayIndex].assignedTime = action.payload.assignedTime;
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
      const freeDays = res.map((freeDay) => {
        return { ...freeDay, assignedTime: 0 };
      });
      dispatch(createHomeworkActions.setFreeDays(freeDays));
    } catch (err) {
      //TODO: handle err
    } finally {
      dispatch(createHomeworkActions.setLoading(false));
    }
  };
};

export default createHomeworkSlice;
export const createHomeworkActions = createHomeworkSlice.actions;
