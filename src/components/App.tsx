import * as React from "react";
import { useAppDispatch, useAppSelector } from "..";
import { LoadingScreen } from "../screens/LoadingScreen";
import { validateUser } from "../slices/usersSlice";
import { AuthenticatedTabNavigator } from "../navigators/AuthenticatedTabNavigator";
import { cleanCacheDirectory } from "../slices/workoutLogsSlice";
import { UnauthenticatedStackNavigator } from "../navigators/UnauthenticatedStackNavigator";
import { useNetInfo } from "@react-native-community/netinfo";
import { NoInternetAlert } from "../util/util";
import RNBootSplash from "react-native-bootsplash";

async function initialize(dispatch: ReturnType<typeof useAppDispatch>) {
  await Promise.all([
    dispatch(cleanCacheDirectory()),
    dispatch(validateUser()),
  ]);
}

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
    initialize(dispatch).then(() => {
      RNBootSplash.hide();
    });
  }, []);

  switch (authenticationStatus) {
    case "unknown":
      return <UnauthenticatedStackNavigator />;
    case "pending":
      return <LoadingScreen />;
    case "confirmed":
      return <AuthenticatedTabNavigator />;
  }
}
