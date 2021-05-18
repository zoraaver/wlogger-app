import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet } from "react-native";
import { WorkoutLogScreen } from "../screens/WorkoutLogScreen";
import { WorkoutLogsScreen } from "../screens/WorkoutLogsScreen";
import { BalsamiqSans, infoColor } from "../util/constants";

export type WorkoutLogStackParamList = {
  index: undefined;
  show: { id: string; dateTitle: string };
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
          headerTitleStyle: styles.screenHeaderTitle,
          headerStyle: styles.screenHeader,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        component={WorkoutLogScreen}
        name="show"
        options={({ route }) => ({
          title: route.params.dateTitle,
          headerBackTitle: "Logs",
          headerStyle: styles.screenHeader,
          headerTitleStyle: styles.screenHeaderTitle,
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  screenHeader: {
    backgroundColor: infoColor,
  },
  screenHeaderTitle: {
    fontFamily: BalsamiqSans,
    fontSize: 25,
  },
});
