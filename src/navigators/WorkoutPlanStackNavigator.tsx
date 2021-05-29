import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { WorkoutPlansScreen } from "../screens/WorkoutPlansScreen";
import { headerStyles } from "./WorkoutLogStackNavigator";

export type WorkoutPlanStackParamList = {
  index: undefined;
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
    </Stack.Navigator>
  );
}
