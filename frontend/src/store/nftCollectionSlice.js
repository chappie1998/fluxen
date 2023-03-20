import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nftCollectionData: [],
};

export const nftCollectionSlice = createSlice({
  name: "nftCollection",
  initialState,
  reducers: {
    setNftCollectionData: (state, action) => {
      state.nftCollectionData = action.payload;
    },
  },
});

export const { setNftCollectionData } = nftCollectionSlice.actions;

export default nftCollectionSlice.reducer;
