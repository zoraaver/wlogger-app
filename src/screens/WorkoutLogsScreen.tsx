import { useRoute } from "@react-navigation/core";
import * as React from "react";
import { View, Text } from "react-native";

export function WorkoutLogsScreen() {
  const route = useRoute();
  return (
    <View>
      <Text>{(route.params as any)?.myparam}</Text>
    </View>
  );
}
