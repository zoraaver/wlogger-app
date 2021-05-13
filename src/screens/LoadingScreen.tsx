import * as React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { infoColor } from "../util/constants";

export function LoadingScreen() {
  return (
    <SafeAreaView style={styles.loadingScreen}>
      <ActivityIndicator size="large" color="black" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: infoColor,
  },
});
