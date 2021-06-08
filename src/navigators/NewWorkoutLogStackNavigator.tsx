import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import * as React from "react";
import { RecordResponse } from "react-native-camera";
import { EditLogEntryScreen } from "../screens/EditLogEntryScreen";
import { NewWorkoutLogScreen } from "../screens/NewWorkoutLogScreen";
import { WorkoutLogCameraScreen } from "../screens/WorkoutLogCameraScreen";
import { WorkoutLogVideoScreen } from "../screens/WorkoutLogVideoScreen";
import { WorkoutLogVideoUploadScreen } from "../screens/WorkoutLogVideoUploadScreen";
import {
  headerStyles,
  WorkoutLogStackParamList,
} from "./WorkoutLogStackNavigator";

export type NewWorkoutLogStackParamList = {
  logForm: RecordResponse & { cancelled: boolean };
  camera: undefined;
  showVideo: WorkoutLogStackParamList["showVideo"];
  upload: undefined;
  editLogEntry: { setIndex: number; exerciseIndex: number; title: string };
};

export type NewLogNavigation = StackNavigationProp<NewWorkoutLogStackParamList>;

const Stack = createStackNavigator<NewWorkoutLogStackParamList>();

export function NewWorkoutLogStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="logForm"
      screenOptions={{
        headerShown: false,
        headerTitleStyle: headerStyles.screenHeaderTitle,
        headerStyle: headerStyles.screenHeader,
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
      <Stack.Screen
        name="editLogEntry"
        component={EditLogEntryScreen}
        options={({ route }) => ({
          headerShown: true,
          headerBackTitle: "New log",
          title: route.params.title,
        })}
      />
    </Stack.Navigator>
  );
}
