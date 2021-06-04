import {
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import * as React from "react";
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
import {
  WorkoutPlanStackNavigator,
  WorkoutPlanStackParamList,
} from "./WorkoutPlanStackNavigator";
import {
  SettingsStackNavigator,
  SettingsStackNavigatorParamList,
} from "./SettingsStackNavigator";
import { HomeStackNavigator, HomeStackParamList } from "./HomeStackNavigator";

type AuthenticatedTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Logs: NavigatorScreenParams<WorkoutLogStackParamList>;
  Plans: NavigatorScreenParams<WorkoutPlanStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackNavigatorParamList>;
  NewLog: NavigatorScreenParams<NewWorkoutLogStackParamList>;
};

export type AuthenticatedNavigation = BottomTabNavigationProp<AuthenticatedTabParamList>;

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

const Tab = createBottomTabNavigator<AuthenticatedTabParamList>();

export function AuthenticatedTabNavigator() {
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
      lazy={false}
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
          <Tab.Screen component={WorkoutPlanStackNavigator} name="Plans" />
          <Tab.Screen component={HomeStackNavigator} name="Home" />
          <Tab.Screen component={SettingsStackNavigator} name="Settings" />
        </>
      )}
    </Tab.Navigator>
  );
}
