import * as React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface CellProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderWidth?: number;
}

export function Cell({ children, style, borderWidth }: CellProps) {
  return (
    <View
      style={[
        styles.cell,
        { borderRightWidth: borderWidth, borderRightColor: "grey" },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
});
