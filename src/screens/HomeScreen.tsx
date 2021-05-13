import { useNavigation } from "@react-navigation/core";
import * as React from "react";
import { Text, SafeAreaView } from "react-native";
import { Button } from "../components/Button";

export function HomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Text>Home screen</Text>
      <Button
        onPress={() => {
          navigation.navigate("Logs", { myparam: "hello" });
        }}
      >
        <Text>Workout logs</Text>
      </Button>
    </SafeAreaView>
  );
}
