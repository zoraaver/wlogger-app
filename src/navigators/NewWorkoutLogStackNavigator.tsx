import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import * as React from "react";
import { RecordResponse } from "react-native-camera";
import { NewWorkoutLogScreen } from "../screens/NewWorkoutLogScreen";
import { WorkoutLogCameraScreen } from "../screens/WorkoutLogCameraScreen";
import { WorkoutLogVideoScreen } from "../screens/WorkoutLogVideoScreen";
import { WorkoutLogVideoUploadScreen } from "../screens/WorkoutLogVideoUploadScreen";
import {
  workoutLogScreenStyles,
  WorkoutLogStackParamList,
} from "./WorkoutLogStackNavigator";

export type NewWorkoutLogStackParamList = {
  logForm: RecordResponse & { cancelled: boolean };
  camera: undefined;
  showVideo: WorkoutLogStackParamList["showVideo"];
  upload: undefined;
};

export type NewLogNavigation = StackNavigationProp<NewWorkoutLogStackParamList>;

const Stack = createStackNavigator<NewWorkoutLogStackParamList>();

export function NewWorkoutLogStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="logForm"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="logForm"
        component={NewWorkoutLogScreen}
        initialParams={{ cancelled: true }}
      />
      <Stack.Screen name="camera" component={WorkoutLogCameraScreen} />
      <Stack.Screen
        name="showVideo"
        component={WorkoutLogVideoScreen}
        options={({ route }) => ({
          title: route.params.videoTitle,
          headerShown: true,
          headerStyle: workoutLogScreenStyles.screenHeader,
          headerTitleStyle: workoutLogScreenStyles.screenHeaderTitle,
          headerTitleAlign: "center",
          headerBackTitle: "New log",
        })}
      />
      <Stack.Screen name="upload" component={WorkoutLogVideoUploadScreen} />
    </Stack.Navigator>
  );
}
