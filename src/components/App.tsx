import * as React from "react";
import { Text } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import LoginScreen from "../screens/LoginScreen";
import { validateUser } from "../slices/usersSlice";

export function App() {
  const dispatch = useAppDispatch();
  const authenticationStatus = useAppSelector(
    (state) => state.user.authenticationStatus
  );

  React.useEffect(() => {
    dispatch(validateUser());
  }, []);

  switch (authenticationStatus) {
    case "unknown":
    case "pending":
      return <LoginScreen />;
    case "confirmed":
      return <Text>Hello!</Text>;
  }
}
