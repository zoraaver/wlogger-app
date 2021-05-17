import * as React from "react";
import { View, Text } from "react-native";

interface HorizontalDividerProps {
  height?: number;
  text?: string;
  backgroundColor: string;
}
export function HorizontalDivider({
  height = 1,
  text,
  backgroundColor,
}: HorizontalDividerProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1, height, backgroundColor }} />
      {text ? (
        <View>
          <Text style={{ width: 40, textAlign: "center", fontSize: 18 }}>
            {text}
          </Text>
        </View>
      ) : null}
      <View style={{ flex: 1, height, backgroundColor }} />
    </View>
  );
}
