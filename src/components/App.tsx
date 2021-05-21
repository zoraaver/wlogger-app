import * as React from "react";
import { useAppDispatch, useAppSelector } from "..";
import { LoadingScreen } from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import { validateUser } from "../slices/usersSlice";
import { HomeTabNavigator } from "../navigators/HomeTabNavigator";
import { cleanCacheDirectory } from "../slices/workoutLogsSlice";

export function App() {
  const dispatch = useAppDispatch();
  const authenticationStatus = useAppSelector(
    (state) => state.user.authenticationStatus
  );

  React.useEffect(() => {
    dispatch(validateUser());
    dispatch(cleanCacheDirectory());
  }, []);

  switch (authenticationStatus) {
    case "unknown":
      return <LoginScreen />;
    case "pending":
      return <LoadingScreen />;
    case "confirmed":
      return <HomeTabNavigator />;
  }
}
