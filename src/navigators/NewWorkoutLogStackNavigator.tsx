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
      screenOptions={{
        headerShown: false,
        headerTitleStyle: workoutLogScreenStyles.screenHeaderTitle,
        headerStyle: workoutLogScreenStyles.screenHeader,
        headerTitleAlign: "center",
      }}
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
          headerBackTitle: "New log",
        })}
      />
      <Stack.Screen
        name="upload"
        component={WorkoutLogVideoUploadScreen}
        options={{
          headerShown: true,
          title: "Uploading videos",
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}
