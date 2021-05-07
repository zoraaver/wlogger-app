import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Colors, Header } from "react-native/Libraries/NewAppScreen";

import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  TypedUseSelectorHook,
  useSelector,
  Provider,
} from "react-redux";

import { Section } from "./Section";
import { userReducer } from "../slices/usersSlice";
import { workoutLogsReducer } from "../slices/workoutLogsSlice";
import { workoutPlansReducer } from "../slices/workoutPlansSlice";
import { workoutsReducer } from "../slices/workoutsSlice";

const store = configureStore({
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

export function App() {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
        >
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}
          >
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your editing.
            </Section>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  highlight: {
    fontWeight: "700",
  },
});

export default App;
