import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  burgerMenuOpen: boolean;
  showBurgerMenu: boolean;
}

const initialState: UiState = {
  burgerMenuOpen: false,
  showBurgerMenu: false,
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
    toggleBurgerMenu(state, action: PayloadAction<boolean>) {
      console.log(action.payload);
      state.showBurgerMenu = action.payload;
    },
  },
});

export default uiSlice;
export const uiActions = uiSlice.actions;
