import * as React from "react";
import { View, Text } from "react-native";
import { useHideTabBarInNestedStack } from "../util/hooks";

export function NewWorkoutLogScreen() {
  useHideTabBarInNestedStack();
  return (
    <View>
      <Text></Text>
    </View>
  );
}
