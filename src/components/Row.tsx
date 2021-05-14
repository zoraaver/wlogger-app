import * as React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface RowProps {
  children: JSX.Element[] | JSX.Element;
  style?: ViewStyle;
  borderWidth?: number;
  topBorder?: boolean;
}

export function Row({ children, style, borderWidth, topBorder }: RowProps) {
  return (
    <View
      style={[
        styles.row,
        { borderBottomWidth: borderWidth, borderLeftWidth: borderWidth },
        topBorder && {
          borderTopWidth: borderWidth,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 1,
    alignItems: "stretch",
    minHeight: 45,
    borderBottomColor: "grey",
  },
});
