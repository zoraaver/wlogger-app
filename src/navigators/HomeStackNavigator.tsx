import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { headerStyles } from "./WorkoutLogStackNavigator";

export type HomeStackParamList = {
  home: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: headerStyles.screenHeaderTitle,
        headerStyle: headerStyles.screenHeader,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ headerTitle: "Home" }}
      />
    </Stack.Navigator>
  );
}
