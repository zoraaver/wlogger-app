import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
} from "react-native";
import { useAppDispatch } from "..";
import { loginUser } from "../slices/usersSlice";
import { Helvetica, primaryColor } from "../util/constants";
import { GoogleButton } from "./GoogleButton";
import { HorizontalDivider } from "./HorizontalDivider";

export default function LoginForm() {
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const dispatch = useAppDispatch();

  function handleSubmit(event: NativeSyntheticEvent<NativeTouchEvent>) {
    dispatch(loginUser(formData));
  }

  return (
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
        onChangeText={(password) => setFormData({ ...formData, password })}
        secureTextEntry
      ></TextInput>
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>
      <HorizontalDivider backgroundColor="powderblue" text="or" />
      <GoogleButton />
    </View>
  );
}

const styles = StyleSheet.create({
  loginForm: {
    alignItems: "stretch",
    maxHeight: 250,
    justifyContent: "space-around",
    flex: 1,
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
  loginInput: {
    height: 40,
    borderWidth: 0.7,
    borderRadius: 10,
    backgroundColor: "white",
    paddingLeft: 15,
    fontFamily: Helvetica,
  },
});
