import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import * as React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { WorkoutPlansScreen } from "../screens/WorkoutPlansScreen";
import { BalsamiqSans, primaryColor } from "../util/constants";
import Ionicon from "react-native-vector-icons/Ionicons";
import {
  WorkoutLogStackNavigator,
  WorkoutLogStackParamList,
} from "./WorkoutLogStackNavigator";

export type HomeTabParamList = {
  Home: undefined;
  Logs: NavigatorScreenParams<WorkoutLogStackParamList>;
  Plans: undefined;
  Settings: undefined;
};

function tabScreenOptions({
  route,
}: {
  route: RouteProp<Record<string, object | undefined>, string>;
  navigation: any;
}): BottomTabNavigationOptions {
  return {
    tabBarIcon: ({ color, size }) => {
      let iconName: string = "";
      switch (route.name) {
        case "Home":
          iconName = "home";
          break;
        case "Plans":
          iconName = "clipboard";
          break;
        case "Settings":
          iconName = "settings";
          break;
        case "Logs":
          iconName = "journal";
          break;
        default:
          break;
      }
      return <Ionicon name={iconName} size={size} color={color} />;
    },
  };
}

const Tab = createBottomTabNavigator<HomeTabParamList>();

export function HomeTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        labelStyle: { fontFamily: BalsamiqSans },
        activeTintColor: primaryColor,
        inactiveTintColor: "grey",
        keyboardHidesTabBar: true,
      }}
      screenOptions={tabScreenOptions}
    >
      <Tab.Screen component={WorkoutLogStackNavigator} name="Logs" />
      <Tab.Screen component={WorkoutPlansScreen} name="Plans" />
      <Tab.Screen component={HomeScreen} name="Home" />
      <Tab.Screen component={SettingsScreen} name="Settings" />
    </Tab.Navigator>
  );
}
