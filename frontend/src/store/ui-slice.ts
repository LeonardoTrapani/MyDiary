import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SHOW_BURGER_MENU_PX } from '../utilities/contants';

interface UiState {
  burgerMenuOpen: boolean;
  showBurgerMenu: boolean;
  isLoading: boolean;
  modalOpened: boolean;
  snackbarOpened: boolean;
  snackBarMessage?: string;
}

const initialState: UiState = {
  burgerMenuOpen: false,
  isLoading: false,
  showBurgerMenu: window.innerWidth <= SHOW_BURGER_MENU_PX,
  modalOpened: false,
  snackbarOpened: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleBurgerMenuShown(state, action: PayloadAction<boolean>) {
      state.showBurgerMenu = action.payload;
    },
    openBurgerMenu(state) {
      state.burgerMenuOpen = true;
    },
    closeBurgerMenu(state) {
      state.burgerMenuOpen = false;
    },
    toggleLoading(state) {
      state.isLoading = !state.isLoading;
    },
    toggleModalOpened(state, action: PayloadAction<boolean>) {
      state.modalOpened = action.payload;
    },
  },
});

export default uiSlice;
export const uiActions = uiSlice.actions;
