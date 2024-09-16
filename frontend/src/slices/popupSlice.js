// src/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    message: "",
    error: "",
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = "";
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = "";
    },
  },
});

export const { setError, setMessage, clearError, clearMessage } =
  popupSlice.actions;
export default popupSlice.reducer;
