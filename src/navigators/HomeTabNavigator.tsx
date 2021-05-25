import {
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
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
import { useAppSelector } from "..";
import {
  NewWorkoutLogStackNavigator,
  NewWorkoutLogStackParamList,
} from "./NewWorkoutLogStackNavigator";

type HomeTabParamList = {
  Home: undefined;
  Logs: NavigatorScreenParams<WorkoutLogStackParamList>;
  Plans: undefined;
  Settings: undefined;
  NewLog: NavigatorScreenParams<NewWorkoutLogStackParamList>;
};

export type HomeNavigation = BottomTabNavigationProp<HomeTabParamList>;

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
          return null;
      }
      return <Ionicon name={iconName} size={size} color={color} />;
    },
  };
}

const Tab = createBottomTabNavigator<HomeTabParamList>();

export function HomeTabNavigator() {
  const logInProgress = useAppSelector((state) => state.UI.logInProgress);

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
      {logInProgress ? (
        <Tab.Screen
          name="NewLog"
          component={NewWorkoutLogStackNavigator}
          options={{ tabBarVisible: false }}
        />
      ) : (
        <>
          <Tab.Screen component={WorkoutLogStackNavigator} name="Logs" />
          <Tab.Screen component={WorkoutPlansScreen} name="Plans" />
          <Tab.Screen component={HomeScreen} name="Home" />
          <Tab.Screen component={SettingsScreen} name="Settings" />
        </>
      )}
    </Tab.Navigator>
  );
}
