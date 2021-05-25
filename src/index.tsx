import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { NavigationContainer } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { App } from "./components/App";
import { UIReducer } from "./slices/UISlice";
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
    UI: UIReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const googleiOSClientId: string =
  "695443910196-nvpotp45hi701vja07bomtpmqeo7395p.apps.googleusercontent.com";
const googleWebClientId: string =
  "695443910196-mc7763ul6h5k5kgf1p08hjfn2pv7kccs.apps.googleusercontent.com";

GoogleSignin.configure({
  iosClientId: googleiOSClientId,
  webClientId: googleWebClientId,
  scopes: ["email"],
});

export function Application() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
