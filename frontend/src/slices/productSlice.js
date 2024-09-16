import { createSlice } from "@reduxjs/toolkit";
const initialSelectedProduct = localStorage.getItem("selectedProduct") || "";
const productSlice = createSlice({
  name: "products",
  initialState: {
    section: "vegetables",
    selectedProduct: initialSelectedProduct,
  },
  reducers: {
    setSection: (state, action) => {
      state.section = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      localStorage.setItem("selectedProduct", action.payload);
    },
  },
});

export const { setSection, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
