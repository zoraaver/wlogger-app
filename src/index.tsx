import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit";
import * as React from "react";
import { UIManager } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { App } from "./components/App";
import { exercisesReducer } from "./slices/exercisesSlice";
import { UIReducer } from "./slices/UISlice";
import { userReducer } from "./slices/usersSlice";
import { workoutLogsReducer } from "./slices/workoutLogsSlice";
import { workoutPlansReducer } from "./slices/workoutPlansSlice";
import { workoutsReducer } from "./slices/workoutsSlice";
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "./config/keys.json";

export const store = configureStore({
  reducer: {
    user: userReducer,
    workoutPlans: workoutPlansReducer,
    workoutLogs: workoutLogsReducer,
    workouts: workoutsReducer,
    exercises: exercisesReducer,
    UI: UIReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

GoogleSignin.configure({
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  webClientId: GOOGLE_WEB_CLIENT_ID,
  scopes: ["email"],
});

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const linking: LinkingOptions = {
  prefixes: ["https://wlogger.uk"],
  config: {
    screens: {
      verify: "/verify/:verificationToken",
    },
  },
};

export function Application() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking}>
          <App />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
