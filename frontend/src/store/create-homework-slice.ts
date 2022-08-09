import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

import { BACKEND_URL } from '../utilities/contants';
import { CustomRequestInit } from '../utilities/hooks';
import { datesEqualOnDay } from '../utilities/utilities';

interface createHomeworkState {
  isLoading: boolean;
  hasError: boolean;
  freeDays: freeDay[];
  selectedDays: freeDay[];
  isChoosingFreeDay: boolean;
  homeworkCreating?: HomeworkCreating;
}

export interface freeDay {
  date: string;
  freeMinutes: number;
  assignedTime: number;
}

export interface selectedDay {
  date: string;
  minutes: number;
}

export interface plannedDate {
  date: string;
  minutes: number;
}
export interface HomeworkCreating {
  name: string;
  subjectId: number;
  description: string;
  duration: number;
  timeToAssign: number;
  expirationDate: string;
}

const initialState: createHomeworkState = {
  isLoading: false,
  isChoosingFreeDay: false,
  hasError: false,
  freeDays: [],
  selectedDays: [],
};
const createHomeworkSlice = createSlice({
  name: 'createHomework',
  initialState,
  reducers: {
    setFreeDays(state, action: PayloadAction<freeDay[]>) {
      if (!state.homeworkCreating) {
        return;
      }
      const { selectedDays } = state;
      const freeDays = action.payload;
      // const selectedDaysToDeleteIndexes = [];
      let reset = false;
      for (let i = 0; i < selectedDays.length; i++) {
        for (let j = 0; j < freeDays.length; j++) {
          if (datesEqualOnDay(selectedDays[i].date, freeDays[j].date)) {
            if (selectedDays[i].freeMinutes === freeDays[j].freeMinutes) {
              freeDays[j] = selectedDays[i];
            } else {
              reset = true;
              i = selectedDays.length;
              j = freeDays.length;
            }
          }
        }
      }

      if (reset) {
        state.freeDays = action.payload;
        state.selectedDays = [];
        state.homeworkCreating.timeToAssign = state.homeworkCreating.duration;
      }

      state.freeDays = freeDays;
    },
    setHomeworkCreating(state, action: PayloadAction<HomeworkCreating>) {
      state.freeDays = initialState.freeDays;
      state.hasError = initialState.hasError;
      state.homeworkCreating = initialState.homeworkCreating;
      state.homeworkCreating = initialState.homeworkCreating;
      state.isChoosingFreeDay = initialState.isChoosingFreeDay;
      state.selectedDays = initialState.selectedDays;
      state.isChoosingFreeDay = true;
      state.homeworkCreating = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<boolean>) {
      state.hasError = action.payload;
    },
    setIsChoosingFreeDay(state, action: PayloadAction<boolean>) {
      state.isChoosingFreeDay = action.payload;
    },
    reset(state) {
      state.freeDays = initialState.freeDays;
      state.hasError = initialState.hasError;
      state.homeworkCreating = initialState.homeworkCreating;
      state.homeworkCreating = initialState.homeworkCreating;
      state.isChoosingFreeDay = initialState.isChoosingFreeDay;
      state.selectedDays = initialState.selectedDays;
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
      const freeDayIndex = state.freeDays.findIndex((freeDay) =>
        datesEqualOnDay(action.payload.freeDay.date, freeDay.date)
      );
      const selectedDaysIndex = state.selectedDays.findIndex((freeDay) =>
        datesEqualOnDay(action.payload.freeDay.date, freeDay.date)
      );

      const existsOnSelectedDays = (i: number) => {
        if (i === -1) {
          return false;
        }
        return true;
      };

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

      const freeDayWithUpdatedAssignedTime = {
        ...action.payload.freeDay,
        assignedTime: action.payload.assignedTime,
      };
      if (!existsOnSelectedDays(selectedDaysIndex)) {
        state.selectedDays.push(freeDayWithUpdatedAssignedTime);
        return;
      }
      if (action.payload.assignedTime === 0) {
        state.selectedDays.splice(selectedDaysIndex, 1);
        return;
      }
      state.selectedDays[selectedDaysIndex] = freeDayWithUpdatedAssignedTime;
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
      dispatch(createHomeworkActions.setError(false));
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
      console.log({ res });
      const freeDays = res.map((freeDay) => {
        const freeDayModified = { ...freeDay, assignedTime: 0 };
        return freeDayModified;
      });
      dispatch(createHomeworkActions.setFreeDays(freeDays));
      setTimeout(() => {
        dispatch(createHomeworkActions.setLoading(false));
      }, 300);
    } catch (err) {
      dispatch(createHomeworkActions.setError(true));
      dispatch(createHomeworkActions.setLoading(false));
    }
  };
};

export const submitCreateHomework = (
  isValid: boolean,
  fetchAuthorized: () => (
    url: string,
    options?: CustomRequestInit | undefined
  ) => unknown,
  homeworkCreating: HomeworkCreating,
  plannedDates: freeDay[],
  navigate: NavigateFunction
) => {
  return async (dispatch: Dispatch) => {
    if (!isValid) {
      console.log('TODO: snackbar or make time red untill next change');
      return;
    }
    dispatch(createHomeworkActions.setLoading(true));
    const { name, description, duration, expirationDate, subjectId } =
      homeworkCreating;

    const formattedPlannedDates = plannedDates.map((selectedDay) => {
      return { date: selectedDay.date, minutes: selectedDay.assignedTime };
    });

    try {
      await fetchAuthorized()(BACKEND_URL + '/homework/create', {
        method: 'POST',
        requestBody: {
          name,
          description,
          expirationDate,
          subjectId,
          duration,
          plannedDates: formattedPlannedDates,
        },
      });
      dispatch(createHomeworkActions.setLoading(false));
      dispatch(createHomeworkActions.reset());
      navigate('/');
    } catch (err) {
      dispatch(createHomeworkActions.setLoading(false));
      console.log('ERROR');
    }
  };
};
export default createHomeworkSlice;
export const createHomeworkActions = createHomeworkSlice.actions;
