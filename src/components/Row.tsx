import * as React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface RowProps {
  children: JSX.Element[] | JSX.Element;
  style?: ViewStyle;
}

export function Row({ children, style }: RowProps) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 1,
    alignItems: "stretch",
    minHeight: 45,
    borderBottomWidth: 0.2,
    borderBottomColor: "grey",
  },
});
