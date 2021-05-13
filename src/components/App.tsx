import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "..";
import { HomeScreen } from "../screens/HomeScreen";
import { LoadingScreen } from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { WorkoutLogsScreen } from "../screens/WorkoutLogsScreen";
import { validateUser } from "../slices/usersSlice";

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
        <Tab.Navigator>
          <Tab.Screen component={WorkoutLogsScreen} name="Logs" />
          <Tab.Screen component={HomeScreen} name="Home" />
          <Tab.Screen component={SettingsScreen} name="Settings" />
        </Tab.Navigator>
      );
  }
}
