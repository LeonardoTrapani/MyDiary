import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AssignTimeState {
  modalOpened: boolean;
  dayInformations?: {
    timeAssigned: number;
    date: string;
    freeMinutes: number;
  };
}

const initialState: AssignTimeState = {
  modalOpened: false,
};

const assignTimeSlice = createSlice({
  name: 'assignTime',
  initialState,
  reducers: {
    setModalOpened(state, action: PayloadAction<boolean>) {
      state.modalOpened = action.payload;
    },
  },
});

export default assignTimeSlice;

export const assignTimeActions = assignTimeSlice.actions;
