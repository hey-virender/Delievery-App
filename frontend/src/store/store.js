// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import cartReducer from "../slices/cartSlice";
import productReducer from "../slices/productSlice";
import popupReducer from "../slices/popupSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
    popup: popupReducer,

    // Add other reducers as needed
  },
});

export default store;
