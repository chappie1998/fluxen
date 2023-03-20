import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import nftReducer from "./nftCollectionSlice";
import loaderReducer from "./loaderSlice";

const reducer = combineReducers({
  nftCollection: nftReducer,
  loader: loaderReducer,
});

export const store = configureStore({
  reducer,
});
