import * as React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Platform,
} from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { loginUser } from "../slices/usersSlice";

export default function LoginScreen() {
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const loginError = useAppSelector((state) => state.user.loginError);

  function handleSubmit(event: NativeSyntheticEvent<NativeTouchEvent>) {
    dispatch(loginUser(formData));
  }

  return (
    <>
      <SafeAreaView style={styles.topSafeAreaView} />
      <SafeAreaView style={styles.loginScreen}>
        <View style={styles.logoArea}>
          <Text style={styles.logoHeader}>wLogger</Text>
          <Text style={styles.logoText}>Track and log workouts</Text>
        </View>
        <View style={styles.inputArea}>
          {loginError && (
            <View>
              <Text style={{ color: "red" }}>{loginError}</Text>
            </View>
          )}
          <View style={styles.loginForm}>
            <TextInput
              style={styles.loginInput}
              placeholder="email"
              placeholderTextColor="grey"
              value={formData.email}
              onChangeText={(email) => setFormData({ ...formData, email })}
            ></TextInput>
            <TextInput
              style={styles.loginInput}
              placeholder="password"
              placeholderTextColor="grey"
              value={formData.password}
              onChangeText={(password) =>
                setFormData({ ...formData, password })
              }
              secureTextEntry
            ></TextInput>
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              <Text style={styles.loginButtonText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const BalsamiqSans: string =
  Platform.OS === "ios" ? "Balsamiq Sans" : "BalsamiqSans-Regular";
const Helvetica: string = "Helvetica Neue";
const infoColor: string = "#5bc0de";
const primaryColor: string = "#0275d8";

const styles = StyleSheet.create({
  topSafeAreaView: { backgroundColor: "powderblue" },
  logoHeader: {
    fontSize: 50,
    fontFamily: BalsamiqSans,
  },
  logoText: { fontSize: 20, fontFamily: BalsamiqSans },
  logoArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "powderblue",
  },
  inputArea: {
    flex: 1,
    backgroundColor: infoColor,
    padding: 20,
  },
  loginInput: {
    height: 40,
    borderWidth: 0.7,
    borderRadius: 10,
    backgroundColor: "white",
    paddingLeft: 15,
    fontFamily: Helvetica,
  },
  loginForm: {
    alignItems: "stretch",
    maxHeight: 150,
    justifyContent: "space-around",
    flex: 1,
  },
  loginScreen: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "stretch",
    backgroundColor: infoColor,
  },
  loginButton: {
    backgroundColor: primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 40,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: Helvetica,
  },
});
