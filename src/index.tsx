import { configureStore } from "@reduxjs/toolkit";
import * as React from "react";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { App } from "./components/App";
import { userReducer } from "./slices/usersSlice";
import { workoutLogsReducer } from "./slices/workoutLogsSlice";
import { workoutPlansReducer } from "./slices/workoutPlansSlice";
import { workoutsReducer } from "./slices/workoutsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    workoutPlans: workoutPlansReducer,
    workoutLogs: workoutLogsReducer,
    workouts: workoutsReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function Application() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
