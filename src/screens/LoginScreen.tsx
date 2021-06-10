import * as React from "react";
import {
  StyleSheet,
  Text,
  Platform,
  KeyboardEventName,
  useWindowDimensions,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { DismissKeyboard } from "../components/DismissKeyboard";
import { HorizontalDivider } from "../components/HorizontalDivider";
import LoginForm from "../components/LoginForm";
import {
  BalsamiqSans,
  Helvetica,
  infoColor,
  successColor,
} from "../util/constants";
import { DeviceOrientation, useKeyboard, useOrientation } from "../util/hooks";
import { useNavigation } from "@react-navigation/core";
import { UnauthenticatedNavigation } from "../navigators/UnauthenticatedStackNavigator";
import { KeyboardEvent } from "../util/hooks";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function LoginScreen() {
  const navigation = useNavigation<UnauthenticatedNavigation>();
  const windowHeight = useWindowDimensions().height;
  const logoAreaMaxHeight = useSharedValue(windowHeight);

  const keyboardEvents = Platform.select({
    ios: { show: "keyboardWillShow", hide: "keyboardWillHide" },
    android: { show: "keyboardDidShow", hide: "keyboardDidHide" },
  }) as { show: KeyboardEventName; hide: KeyboardEventName };

  const isLandScape = useOrientation() === DeviceOrientation.landscape;

  useKeyboard(
    keyboardEvents.show,
    (event: KeyboardEvent) =>
      (logoAreaMaxHeight.value = withTiming(
        windowHeight / (isLandScape ? 1.8 : 4),
        {
          duration: event.duration * 1.5,
        }
      )),
    [isLandScape, windowHeight]
  );

  useKeyboard(
    keyboardEvents.hide,
    (event: KeyboardEvent) =>
      (logoAreaMaxHeight.value = withTiming(windowHeight, {
        duration: event.duration * 1.5,
      })),
    [windowHeight]
  );

  const animatedLogoAreaStyle = useAnimatedStyle(() => ({
    maxHeight: logoAreaMaxHeight.value,
  }));

  return (
    <DismissKeyboard>
      <View
        style={[
          styles.loginScreen,
          { flexDirection: isLandScape ? "row" : "column" },
        ]}
      >
        <Animated.View style={[styles.logoArea, animatedLogoAreaStyle]}>
          <Text style={styles.logoHeader}>wLogger</Text>
          <Text style={styles.logoText}>Track and log workouts</Text>
        </Animated.View>
        <View style={styles.inputArea}>
          <LoginForm />
          <HorizontalDivider backgroundColor="powderblue" text="or" />
          <Button
            color={successColor}
            onPress={() => navigation.navigate("signup")}
          >
            <Text style={styles.signupButtonText}>Create an account</Text>
          </Button>
        </View>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  logoHeader: {
    fontSize: 50,
    fontFamily: BalsamiqSans,
  },
  logoText: { fontSize: 20, fontFamily: BalsamiqSans },
  logoArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "powderblue",
  },
  inputArea: {
    flex: 1,
    backgroundColor: infoColor,
    padding: 20,
    justifyContent: "space-between",
  },
  loginScreen: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "stretch",
    backgroundColor: infoColor,
  },
  signupButtonText: {
    fontFamily: Helvetica,
    color: "white",
    fontSize: 18,
  },
});
