import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as React from "react";
import { Text, Image, StyleSheet } from "react-native";
import { AppDispatch, useAppDispatch } from "..";
import { OAuthLoginUser } from "../slices/usersSlice";
import { Helvetica, primaryColor } from "../util/constants";
import { Button } from "./Button";

async function handleGoogleSignIn(dispatch: AppDispatch) {
  try {
    const playServicesAvailable: boolean = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    if (playServicesAvailable) {
      const userInfo = await GoogleSignin.signIn();
      dispatch(
        OAuthLoginUser({
          idToken: userInfo.idToken as string,
          OAuthProvider: "google",
        })
      );
    }
  } catch (error) {}
}

export function GoogleButton() {
  const dispatch = useAppDispatch();

  return (
    <Button color={primaryColor} onPress={() => handleGoogleSignIn(dispatch)}>
      <Image
        source={require("../assets/images/google_logo.png")}
        style={styles.googleButtonImage}
      />
      <Text style={styles.googleLoginButtonText}>Sign in with Google</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  googleLoginButtonText: {
    fontFamily: Helvetica,
    color: "white",
    fontSize: 18,
  },
  googleButtonImage: {
    width: 25,
    height: 25,
    backgroundColor: "white",
    position: "absolute",
    left: 8,
    padding: 10,
    borderRadius: 5,
  },
});
