import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as React from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAppDispatch } from "..";
import { googleLoginUser } from "../slices/usersSlice";
import { Helvetica, primaryColor } from "../util/constants";

export function GoogleButton() {
  const dispatch = useAppDispatch();
  async function handleGoogleSignIn() {
    try {
      const playServicesAvailable: boolean = await GoogleSignin.hasPlayServices(
        {
          showPlayServicesUpdateDialog: true,
        }
      );
      if (playServicesAvailable) {
        const userInfo = await GoogleSignin.signIn();
        dispatch(googleLoginUser(userInfo.idToken as string));
      }
    } catch (error) {}
  }

  return (
    <TouchableOpacity
      style={styles.googleLoginButton}
      onPress={handleGoogleSignIn}
    >
      <Image
        source={require("../assets/images/google_logo.png")}
        style={{
          width: 25,
          height: 25,
          backgroundColor: "white",
          padding: 15,
          borderRadius: 5,
          marginRight: 60,
          marginLeft: 10,
        }}
      />
      <Text style={styles.googleLoginButtonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleLoginButton: {
    flexDirection: "row",
    backgroundColor: primaryColor,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  googleLoginButtonText: {
    fontFamily: Helvetica,
    color: "white",
    fontSize: 18,
  },
});
