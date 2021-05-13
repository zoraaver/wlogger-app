import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "..";
import { HomeScreen } from "../screens/HomeScreen";
import { LoadingScreen } from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { WorkoutLogsScreen } from "../screens/WorkoutLogsScreen";
import { validateUser } from "../slices/usersSlice";
import Ionicon from "react-native-vector-icons/Ionicons";
import { primaryColor } from "../util/constants";
import { WorkoutPlansScreen } from "../screens/WorkoutPlansScreen";

export function App() {
  const dispatch = useAppDispatch();
  const authenticationStatus = useAppSelector(
    (state) => state.user.authenticationStatus
  );

  const Tab = createBottomTabNavigator();

  React.useEffect(() => {
    dispatch(validateUser());
  }, []);

  switch (authenticationStatus) {
    case "unknown":
      return <LoginScreen />;
    case "pending":
      return <LoadingScreen />;
    case "confirmed":
      return (
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: primaryColor,
            inactiveTintColor: "grey",
            keyboardHidesTabBar: true,
          }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
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
          })}
        >
          <Tab.Screen component={WorkoutLogsScreen} name="Logs" />
          <Tab.Screen component={WorkoutPlansScreen} name="Plans" />
          <Tab.Screen component={HomeScreen} name="Home" />
          <Tab.Screen component={SettingsScreen} name="Settings" />
        </Tab.Navigator>
      );
  }
}
