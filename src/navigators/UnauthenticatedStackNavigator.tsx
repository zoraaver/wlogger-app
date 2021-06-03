import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import * as React from "react";
import LoginScreen from "../screens/LoginScreen";
import { SignupScreen } from "../screens/SignupScreen";
import { VerifyScreen } from "../screens/VerifyScreen";
import { headerStyles } from "./WorkoutLogStackNavigator";

export type UnauthenticatedNavigatorStackParamList = {
  login: undefined;
  verify: { verificationToken?: string };
  signup: undefined;
};

export type UnauthenticatedNavigation = StackNavigationProp<UnauthenticatedNavigatorStackParamList>;

const Stack = createStackNavigator<UnauthenticatedNavigatorStackParamList>();

export function UnauthenticatedStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        headerTitleStyle: headerStyles.screenHeaderTitle,
        headerStyle: headerStyles.screenHeader,
        headerTitleAlign: "center",
      }}
      mode="modal"
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="verify" component={VerifyScreen} />
      <Stack.Screen
        name="signup"
        component={SignupScreen}
        options={{
          headerShown: true,
          headerTitle: "Signup",
          headerBackTitle: "Login",
        }}
      />
    </Stack.Navigator>
  );
}
