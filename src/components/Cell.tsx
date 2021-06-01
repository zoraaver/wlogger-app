import * as React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";

interface CellProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderWidth?: number;
}

export function Cell({ children, style, borderWidth }: CellProps) {
  return (
    <View
      style={[
        styles.cell,
        {
          borderLeftWidth: borderWidth,
          borderTopWidth: borderWidth,
          borderRightColor: "grey",
        },
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
  },
});
