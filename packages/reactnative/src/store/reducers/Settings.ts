import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  autoSign: false
};

export const settingsSlice = createSlice({
  name: 'SETTINGS',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      const { key, value } = action.payload;

      return {
        ...state,
        [key]: value
      };
    },
    toggleAutoSign: state => {
      return {
        ...state,
        autoSign: !state.autoSign
      };
    }
  }
});

export const { updateSettings, toggleAutoSign } = settingsSlice.actions;

export default settingsSlice.reducer;
