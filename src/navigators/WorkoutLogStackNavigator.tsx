import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet } from "react-native";
import { WorkoutLogScreen } from "../screens/WorkoutLogScreen";
import { WorkoutLogsScreen } from "../screens/WorkoutLogsScreen";
import { WorkoutLogVideoScreen } from "../screens/WorkoutLogVideoScreen";
import { BalsamiqSans, infoColor } from "../util/constants";

export type WorkoutLogStackParamList = {
  index: undefined;
  show: { id: string; dateTitle: string };
  showVideo: { videoUrl: string; videoTitle: string; hideTabBar?: boolean };
};

const Stack = createStackNavigator<WorkoutLogStackParamList>();

export function WorkoutLogStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="index"
      screenOptions={{
        headerTitleStyle: workoutLogScreenStyles.screenHeaderTitle,
        headerStyle: workoutLogScreenStyles.screenHeader,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        component={WorkoutLogsScreen}
        name="index"
        options={{
          headerTitle: "Logs",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        component={WorkoutLogScreen}
        name="show"
        options={({ route }) => ({
          title: route.params.dateTitle,
          headerBackTitle: "Logs",
        })}
      />
      <Stack.Screen
        component={WorkoutLogVideoScreen}
        name="showVideo"
        options={({ route }) => ({
          title: route.params.videoTitle,
        })}
      />
    </Stack.Navigator>
  );
}

export const workoutLogScreenStyles = StyleSheet.create({
  screenHeader: {
    backgroundColor: infoColor,
  },
  screenHeaderTitle: {
    fontFamily: BalsamiqSans,
    fontSize: 25,
  },
});
