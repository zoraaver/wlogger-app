import * as React from "react";
import { useAppDispatch, useAppSelector } from "..";
import { LoadingScreen } from "../screens/LoadingScreen";
import { validateUser } from "../slices/usersSlice";
import { HomeTabNavigator } from "../navigators/HomeTabNavigator";
import { cleanCacheDirectory } from "../slices/workoutLogsSlice";
import { UnauthenticatedStackNavigator } from "../navigators/UnauthenticatedStackNavigator";
import { useNetInfo } from "@react-native-community/netinfo";
import { NoInternetAlert } from "../util/util";

export function App() {
  const dispatch = useAppDispatch();

  const authenticationStatus = useAppSelector(
    (state) => state.user.authenticationStatus
  );

  const { isInternetReachable } = useNetInfo();

  React.useEffect(() => {
    if (isInternetReachable === false) NoInternetAlert();
  }, [isInternetReachable]);

  React.useEffect(() => {
    dispatch(validateUser());
    dispatch(cleanCacheDirectory());
  }, []);

  switch (authenticationStatus) {
    case "unknown":
      return <UnauthenticatedStackNavigator />;
    case "pending":
      return <LoadingScreen />;
    case "confirmed":
      return <HomeTabNavigator />;
  }
}
