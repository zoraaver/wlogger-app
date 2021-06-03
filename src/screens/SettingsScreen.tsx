import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { logoutUser } from "../slices/usersSlice";
import { Helvetica } from "../util/constants";

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector((state) => state.user.data?.email) as string;
  return (
    <View style={styles.settingsScreen}>
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>Logged in as {userEmail}</Text>
        <Button onPress={() => dispatch(logoutUser())}>
          <Text style={styles.buttonText}>Logout</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsScreen: {
    flex: 1,
    backgroundColor: "powderblue",
  },
  buttonText: { fontFamily: Helvetica, fontSize: 18, color: "white" },
  userInfo: { padding: 20, flex: 1 },
  userInfoText: { textAlign: "center", paddingVertical: 10, fontSize: 22 },
});
