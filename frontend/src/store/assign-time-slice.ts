import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AssignTimeState {
  modalOpened: boolean;
  dayInformations: {
    timeAssigned: number;
    date: string;
    freeMinutes: number;
  };
}

const initialState: AssignTimeState = {
  modalOpened: false,
  dayInformations: {
    timeAssigned: 0,
    date: '',
    freeMinutes: 0,
  },
};

const assignTimeSlice = createSlice({
  name: 'assignTime',
  initialState,
  reducers: {
    setModalOpened(state, action: PayloadAction<boolean>) {
      state.modalOpened = action.payload;
    },
    assignTime(
      state,
      action: PayloadAction<{
        timeAssigned: number;
        date: string;
        freeMinutes: number;
      }>
    ) {
      state.dayInformations = action.payload;
      state.modalOpened = true;
    },
  },
});

export default assignTimeSlice;

export const assignTimeActions = assignTimeSlice.actions;
