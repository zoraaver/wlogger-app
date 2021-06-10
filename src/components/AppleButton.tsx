import {
  appleAuth,
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication";
import * as React from "react";
import { Image, Platform, StyleSheet, Text } from "react-native";
import { AppDispatch, useAppDispatch } from "..";
import { backendUrl } from "../config/axios.config";
import { OAuthLoginUser } from "../slices/usersSlice";
import { Helvetica } from "../util/constants";
import { Button } from "./Button";

const APPLE_CLIENT_ID = "uk.wlogger";

function handleAppleSignIn(dispatch: AppDispatch) {
  if (Platform.OS === "ios") {
    handleIOSAppleSignIn(dispatch);
  } else if (Platform.OS === "android") {
    handleAndroidAppleSignIn(dispatch);
  }
}

async function handleAndroidAppleSignIn(dispatch: AppDispatch) {
  try {
    appleAuthAndroid.configure({
      clientId: APPLE_CLIENT_ID,
      redirectUri: backendUrl,
      responseType: appleAuthAndroid.ResponseType.ID_TOKEN,
      scope: appleAuthAndroid.Scope.EMAIL,
    });

    const response = await appleAuthAndroid.signIn();
    if (response.id_token) {
      dispatch(
        OAuthLoginUser({ idToken: response.id_token, OAuthProvider: "apple" })
      );
    }
  } catch (error) {}
}

async function handleIOSAppleSignIn(dispatch: AppDispatch) {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    if (
      credentialState === appleAuth.State.AUTHORIZED &&
      appleAuthRequestResponse.identityToken !== null
    ) {
      dispatch(
        OAuthLoginUser({
          idToken: appleAuthRequestResponse.identityToken,
          OAuthProvider: "apple",
        })
      );
    }
  } catch (error) {}
}

export function AppleButton() {
  const dispatch = useAppDispatch();

  return (
    <Button color="black" onPress={() => handleAppleSignIn(dispatch)}>
      <Image
        source={require("../assets/images/apple_logo.png")}
        style={styles.appleLogo}
      />
      <Text style={styles.buttonText}>Sign in with Apple</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonText: { color: "white", fontFamily: Helvetica, fontSize: 18 },
  appleLogo: {
    height: 35,
    width: 35,
    position: "absolute",
    left: 4,
  },
});
