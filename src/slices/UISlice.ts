import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { logInProgress: false };

const slice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setLogInProgress: (state, action: PayloadAction<boolean>) => {
      state.logInProgress = action.payload;
    },
  },
});

export const { setLogInProgress } = slice.actions;
export const UIReducer = slice.reducer;
