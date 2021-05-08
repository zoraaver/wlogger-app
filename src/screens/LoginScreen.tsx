import * as React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { useAppSelector } from "..";
import LoginForm from "../components/LoginForm";
import { BalsamiqSans, infoColor } from "../util/constants";

export default function LoginScreen() {
  const loginError = useAppSelector((state) => state.user.loginError);

  return (
    <>
      <SafeAreaView style={styles.topSafeAreaView} />
      <SafeAreaView style={styles.loginScreen}>
        <View style={styles.logoArea}>
          <Text style={styles.logoHeader}>wLogger</Text>
          <Text style={styles.logoText}>Track and log workouts</Text>
        </View>
        <View style={styles.inputArea}>
          {loginError && (
            <View>
              <Text style={{ color: "red" }}>{loginError}</Text>
            </View>
          )}
          <LoginForm />
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
  },
  loginScreen: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "stretch",
    backgroundColor: infoColor,
  },
});
