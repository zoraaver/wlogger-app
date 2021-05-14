import * as React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface CellProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Cell({ children, style }: CellProps) {
  return <View style={[styles.cell, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 0.2,
    borderRightColor: "grey",
  },
});
