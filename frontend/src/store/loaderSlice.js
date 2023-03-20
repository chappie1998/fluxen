import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: false,
};

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { showLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
