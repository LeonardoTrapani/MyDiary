import { createSlice } from '@reduxjs/toolkit';

interface InitialAuthState {
  initialAuthDone: boolean;
  initialAuthLoading: boolean;
}
const initialState: InitialAuthState = {
  initialAuthDone: false,
  initialAuthLoading: true,
};

const initialAuthSlice = createSlice({
  name: 'initialAuth',
  initialState,
  reducers: {
    initialAuthDone(state) {
      state.initialAuthDone = true;
      state.initialAuthLoading = false;
    },
  },
});

export default initialAuthSlice;

export const initialAuthActions = initialAuthSlice.actions;
