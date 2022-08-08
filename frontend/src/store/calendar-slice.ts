import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { BACKEND_URL } from '../utilities/contants';
import { CustomRequestInit } from '../utilities/hooks';

interface CalendarState {
  isLoading: boolean;
  hasError: boolean;
  calendar: Calendar;
}

export interface CalendarDayType {
  date: string;
  freeTime: number;
  disabled: boolean;
  homework: CalendarHomework[];
}

type Calendar = CalendarDayType[];

export interface CalendarHomework {
  homeworkId: number;
  subject: string;
  minutesOccupied: number;
  name: string;
}

const initialState: CalendarState = {
  calendar: [],
  hasError: false,
  isLoading: false,
};
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCalendar(state, action: PayloadAction<Calendar>) {
      state.calendar = action.payload;
    },
    setError(state, action: PayloadAction<boolean>) {
      state.hasError = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const fetchCalendar = (
  fetchAuthorized: () => (
    url: string,
    options?: CustomRequestInit | undefined
  ) => unknown,
  page: number
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(calendarActions.setLoading(true));
      dispatch(calendarActions.setError(false));
      const calendar = (await fetchAuthorized()(
        BACKEND_URL + '/calendar/' + page
      )) as Calendar;
      dispatch(calendarActions.setCalendar(calendar));
      setTimeout(() => {
        dispatch(calendarActions.setLoading(false));
      }, 300);
    } catch (err) {
      dispatch(calendarActions.setError(true));
      dispatch(calendarActions.setLoading(false));
    }
  };
};
export default calendarSlice;

export const calendarActions = calendarSlice.actions;
