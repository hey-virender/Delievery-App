import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    firebaseId: null,
    name: "",
    phone: "",
    addresses: [],
    isAuthenticated: false,
  },
  reducers: {
    clearUser: (state) => {
      state.firebaseId = null;
      state.name = "";
      state.phone = "";
      state.address = [];
    },
    setUser: (state, action) => {
      state.firebaseId = action.payload.firebaseId;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.addresses = [...state.addresses, action.payload.addresses];
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { clearUser, setUser,setAuthenticated } = userSlice.actions;
export default userSlice.reducer;
