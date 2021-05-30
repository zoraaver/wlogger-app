import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { WorkoutPlanScreen } from "../screens/WorkoutPlanScreen";
import { WorkoutPlansScreen } from "../screens/WorkoutPlansScreen";
import { workoutPlanData } from "../slices/workoutPlansSlice";
import { headerStyles } from "./WorkoutLogStackNavigator";

export type WorkoutPlanStackParamList = {
  index: undefined;
  show: workoutPlanData;
};

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
    </Stack.Navigator>
  );
}
