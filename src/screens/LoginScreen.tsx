import * as React from "react";
import {
  StyleSheet,
  Text,
  Animated,
  Platform,
  KeyboardEventName,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { useKeyboard } from "../util/hooks";
import { useNavigation } from "@react-navigation/core";
import { UnauthenticatedNavigation } from "../navigators/UnauthenticatedStackNavigator";

export default function LoginScreen() {
  const navigation = useNavigation<UnauthenticatedNavigation>();
  const windowHeight = useWindowDimensions().height;
  const logoAreaMaxHeight = React.useRef(new Animated.Value(windowHeight))
    .current;

  const keyboardEvents = Platform.select({
    ios: { show: "keyboardWillShow", hide: "keyboardWillHide" },
    android: { show: "keyboardDidShow", hide: "keyboardDidHide" },
  }) as { show: KeyboardEventName; hide: KeyboardEventName };

  useKeyboard(keyboardEvents.show, decreaseLogoAreaHeightAnimation);
  useKeyboard(keyboardEvents.hide, increaseLogoAreaHeightAniimation);

  function decreaseLogoAreaHeightAnimation(event: any) {
    Animated.timing(logoAreaMaxHeight, {
      toValue: windowHeight / 4.0,
      duration: event.duration * 1.5,
      useNativeDriver: false,
    }).start();
  }

  function increaseLogoAreaHeightAniimation(event: any) {
    Animated.timing(logoAreaMaxHeight, {
      toValue: windowHeight,
      duration: event.duration * 1.5,
      useNativeDriver: false,
    }).start();
  }

  return (
    <DismissKeyboard>
      <SafeAreaView
        style={styles.loginScreen}
        edges={["bottom", "right", "left"]}
      >
        <Animated.View
          style={[styles.logoArea, { maxHeight: logoAreaMaxHeight }]}
        >
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
      </SafeAreaView>
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
