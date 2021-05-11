import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as React from "react";
import { Text, Image, StyleSheet } from "react-native";
import { useAppDispatch } from "..";
import { googleLoginUser } from "../slices/usersSlice";
import { Helvetica, primaryColor } from "../util/constants";
import { Button } from "./Button";

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
    <Button
      color={primaryColor}
      style={styles.googleLoginButton}
      onPress={handleGoogleSignIn}
    >
      <Image
        source={require("../assets/images/google_logo.png")}
        style={styles.googleButtonImage}
      />
      <Text style={styles.googleLoginButtonText}>Sign in with Google</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  googleLoginButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 10,
  },
  googleLoginButtonText: {
    fontFamily: Helvetica,
    color: "white",
    fontSize: 18,
  },
  googleButtonImage: {
    width: 25,
    height: 25,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginRight: 60,
  },
});
