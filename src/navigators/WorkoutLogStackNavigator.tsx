import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet } from "react-native";
import { WorkoutLogScreen } from "../screens/WorkoutLogScreen";
import { WorkoutLogsScreen } from "../screens/WorkoutLogsScreen";
import { BalsamiqSans, infoColor } from "../util/constants";

export type WorkoutLogStackParamList = {
  index: undefined;
  show: { id: string };
};

const Stack = createStackNavigator<WorkoutLogStackParamList>();

export function WorkoutLogStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen
        component={WorkoutLogsScreen}
        name="index"
        options={{
          headerTitle: "Logs",
          headerTitleStyle: styles.workoutLogsScreenHeaderTitle,
          headerStyle: styles.workoutLogsScreenHeader,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        component={WorkoutLogScreen}
        name="show"
        options={{ headerBackTitle: "Logs" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  workoutLogsScreenHeader: { backgroundColor: infoColor },
  workoutLogsScreenHeaderTitle: { fontFamily: BalsamiqSans, fontSize: 25 },
});
