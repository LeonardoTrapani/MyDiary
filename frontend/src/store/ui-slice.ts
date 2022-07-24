import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SHOW_BURGER_MENU_PX } from '../contants';

interface UiState {
  burgerMenuOpen: boolean;
  showBurgerMenu: boolean;
}

const initialState: UiState = {
  burgerMenuOpen: false,
  showBurgerMenu: window.innerWidth <= SHOW_BURGER_MENU_PX,
};

// 'sm': '640px',
//       // => @media (min-width: 640px) { ... }

//       'md': '768px',
//       // => @media (min-width: 768px) { ... }

//       'lg': '1024px',
//       // => @media (min-width: 1024px) { ... }

//       'xl': '1280px',
//       // => @media (min-width: 1280px) { ... }

//       '2xl': '1536px',
//       // => @media (min-width: 1536px) { ... }

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleBurgerMenuShown(state, action: PayloadAction<boolean>) {
      console.log('SHOW:', action.payload);
      state.showBurgerMenu = action.payload;
    },
    openBurgerMenu(state) {
      state.burgerMenuOpen = true;
    },
    closeBurgerMenu(state) {
      state.burgerMenuOpen = false;
    },
  },
});

export default uiSlice;
export const uiActions = uiSlice.actions;
