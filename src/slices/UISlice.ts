import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Day, weekData } from "./workoutPlansSlice";

interface NewWorkoutModalArgs {
  remainingDays: Day[];
  weekPosition: weekData["position"];
  weekTitle: string;
}

interface UIState {
  logInProgress: boolean;
  newWorkoutModalData?: NewWorkoutModalArgs;
}
const initialState: UIState = { logInProgress: false };

const slice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setLogInProgress(state, action: PayloadAction<boolean>) {
      state.logInProgress = action.payload;
    },
    setNewWorkoutModalData(
      state,
      action: PayloadAction<NewWorkoutModalArgs | undefined>
    ) {
      state.newWorkoutModalData = action.payload;
    },
  },
});

export const { setLogInProgress, setNewWorkoutModalData } = slice.actions;
export const UIReducer = slice.reducer;
