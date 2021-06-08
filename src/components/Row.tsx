import * as React from "react";
import { View, StyleSheet, ViewStyle, TouchableHighlight } from "react-native";

interface RowProps {
  children: JSX.Element[] | JSX.Element;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Row({ children, style, onPress }: RowProps) {
  return onPress ? (
    <TouchableHighlight
      underlayColor="lightyellow"
      activeOpacity={0.5}
      onPress={onPress}
      style={{ flex: 1 }}
    >
      <View style={[styles.row, style]}>{children}</View>
    </TouchableHighlight>
  ) : (
    <View style={[styles.row, style]}>{children}</View>
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
