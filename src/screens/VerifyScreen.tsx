import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import * as React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAppDispatch } from "..";
import {
  UnauthenticatedNavigation,
  UnauthenticatedNavigatorStackParamList,
} from "../navigators/UnauthenticatedStackNavigator";
import { verifyUser } from "../slices/usersSlice";
import { BalsamiqSans, infoColor } from "../util/constants";

export function VerifyScreen() {
  const {
    params: { verificationToken },
  } = useRoute<RouteProp<UnauthenticatedNavigatorStackParamList, "verify">>();
  const navigation = useNavigation<UnauthenticatedNavigation>();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (verificationToken) {
      dispatch(verifyUser(verificationToken))
        .then((value) => {
          if (value.type.includes("rejected")) {
            navigation.navigate("login");
          }
        })
        .catch(() => navigation.navigate("login"));
    } else {
      navigation.navigate("login");
    }
  }, [verificationToken]);

  return (
    <View style={styles.verifyScreen}>
      <Text style={styles.verifyText}>Verifying email address</Text>
      <ActivityIndicator size="large" color="aliceblue" />
    </View>
  );
}

const styles = StyleSheet.create({
  verifyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: infoColor,
  },
  verifyText: { fontFamily: BalsamiqSans, fontSize: 22, paddingVertical: 20 },
});
