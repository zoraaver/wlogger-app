import * as React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { Button } from "../components/Button";
import { HorizontalDivider } from "../components/HorizontalDivider";
import LoginForm from "../components/LoginForm";
import { SignupModal } from "../components/SignupModal";
import {
  BalsamiqSans,
  Helvetica,
  infoColor,
  successColor,
} from "../util/constants";

export default function LoginScreen() {
  const [showSignupModal, setShowSignupModal] = React.useState(false);

  return (
    <>
      <SafeAreaView style={styles.topSafeAreaView} />
      <SafeAreaView style={styles.loginScreen}>
        <SignupModal
          showSignupModal={showSignupModal}
          setShowSignupModal={setShowSignupModal}
        />
        <View style={styles.logoArea}>
          <Text style={styles.logoHeader}>wLogger</Text>
          <Text style={styles.logoText}>Track and log workouts</Text>
        </View>
        <View style={styles.inputArea}>
          <LoginForm />
          <HorizontalDivider backgroundColor="powderblue" text="or" />
          <Button color={successColor} onPress={() => setShowSignupModal(true)}>
            <Text style={styles.signupButtonText}>Create an account</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  topSafeAreaView: { backgroundColor: "powderblue" },
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
