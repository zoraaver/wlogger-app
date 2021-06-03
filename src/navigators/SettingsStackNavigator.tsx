import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { SettingsScreen } from "../screens/SettingsScreen";
import { headerStyles } from "./WorkoutLogStackNavigator";

export type SettingsStackNavigatorParamList = {
  mainSettings: undefined;
};

const Stack = createStackNavigator<SettingsStackNavigatorParamList>();

export function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="mainSettings"
      screenOptions={{
        headerTitleStyle: headerStyles.screenHeaderTitle,
        headerStyle: headerStyles.screenHeader,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="mainSettings"
        component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
      />
    </Stack.Navigator>
  );
}
