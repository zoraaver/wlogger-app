import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { NewWorkoutLogScreen } from "../screens/NewWorkoutLogScreen";
import { WorkoutLogCameraScreen } from "../screens/WorkoutLogCameraScreen";

export type NewWorkoutLogStackParamList = {
  logForm: undefined;
  camera: undefined;
};

const Stack = createStackNavigator<NewWorkoutLogStackParamList>();

export function NewWorkoutLogStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="logForm"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="logForm" component={NewWorkoutLogScreen} />
      <Stack.Screen name="camera" component={WorkoutLogCameraScreen} />
    </Stack.Navigator>
  );
}
