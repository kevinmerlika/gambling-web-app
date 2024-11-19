// store/drawerSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface DrawerState {
  isOpen: boolean;
}

const initialState: DrawerState = {
  isOpen: false, // Sidebar is closed by default
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isOpen = true;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;

export default drawerSlice.reducer;
