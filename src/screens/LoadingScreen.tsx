import * as React from "react";
import { ActivityIndicator, ColorValue, StyleSheet, View } from "react-native";
import { infoColor } from "../util/constants";

interface LoadingScreenProps {
  backgroundColor?: ColorValue;
}

export function LoadingScreen({
  backgroundColor = infoColor,
}: LoadingScreenProps) {
  return (
    <View style={[styles.loadingScreen, { backgroundColor }]}>
      <ActivityIndicator size="large" color="black" />
    </View>
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
