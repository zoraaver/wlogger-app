import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import * as React from "react";
import { WorkoutPlanScreen } from "../screens/WorkoutPlanScreen";
import { WorkoutPlansScreen } from "../screens/WorkoutPlansScreen";
import { WorkoutScreen } from "../screens/WorkoutScreen";
import { Day, workoutPlanHeaderData } from "../slices/workoutPlansSlice";
import { headerStyles } from "./WorkoutLogStackNavigator";

export type WorkoutPlanStackParamList = {
  index: undefined;
  show: workoutPlanHeaderData;
  showWorkout: {
    dayOfWeek: Day;
    weekPosition: number;
    title: string;
  };
};

export type WorkoutPlanNavigation = StackNavigationProp<WorkoutPlanStackParamList>;

const Stack = createStackNavigator<WorkoutPlanStackParamList>();

export function WorkoutPlanStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="index"
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: headerStyles.screenHeader,
        headerTitleStyle: headerStyles.screenHeaderTitle,
      }}
    >
      <Stack.Screen
        name="index"
        component={WorkoutPlansScreen}
        options={{ title: "My plans" }}
      />
      <Stack.Screen
        name="show"
        component={WorkoutPlanScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen
        name="showWorkout"
        component={WorkoutScreen}
        options={({ route }) => ({
          title: route.params.title,
        })}
      />
    </Stack.Navigator>
  );
}
