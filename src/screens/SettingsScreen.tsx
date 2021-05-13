import * as React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "..";
import { Button } from "../components/Button";
import { logoutUser } from "../slices/usersSlice";

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  return (
    <SafeAreaView>
      <Button onPress={() => dispatch(logoutUser())}>
        <Text>Logout</Text>
      </Button>
    </SafeAreaView>
  );
}
