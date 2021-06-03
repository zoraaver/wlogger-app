import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import * as React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import {
  UnauthenticatedNavigation,
  UnauthenticatedNavigatorStackParamList,
} from "../navigators/UnauthenticatedStackNavigator";
import { verifyUser } from "../slices/usersSlice";
import { BalsamiqSans, Helvetica, infoColor } from "../util/constants";

export function VerifyScreen() {
  const {
    params: { verificationToken },
  } = useRoute<RouteProp<UnauthenticatedNavigatorStackParamList, "verify">>();
  const navigation = useNavigation<UnauthenticatedNavigation>();
  const dispatch = useAppDispatch();
  const verificationError = useAppSelector(
    (state) => state.user.verificationError
  );

  React.useEffect(() => {
    if (verificationToken) {
      dispatch(verifyUser(verificationToken));
    } else {
      navigation.navigate("login");
    }
  }, [verificationToken]);

  return (
    <View style={styles.verifyScreen}>
      {verificationError ? (
        <>
          <Text style={styles.verifyText}>
            Oops something went wrong...{"\n"} Verification failed
          </Text>
          <Button onPress={() => navigation.navigate("login")}>
            <Text style={styles.buttonText}>Back to login</Text>
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.verifyText}>Verifying email address</Text>
          <ActivityIndicator size="large" color="aliceblue" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  verifyScreen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: infoColor,
    paddingHorizontal: 20,
  },
  verifyText: {
    fontFamily: BalsamiqSans,
    fontSize: 22,
    paddingVertical: 20,
    textAlign: "center",
  },
  buttonText: {
    fontFamily: Helvetica,
    fontSize: 18,
    color: "white",
  },
});
