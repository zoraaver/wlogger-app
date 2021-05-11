import * as React from "react";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
} from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { loginUser } from "../slices/usersSlice";
import { Helvetica } from "../util/constants";
import { Button } from "./Button";
import { GoogleButton } from "./GoogleButton";

export default function LoginForm() {
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const loginError = useAppSelector((state) => state.user.loginError);
  const passwordInputRef: React.RefObject<TextInput> = React.useRef<TextInput>(
    null
  );

  function handleSubmit(event: NativeSyntheticEvent<NativeTouchEvent>) {
    dispatch(loginUser(formData));
  }

  return (
    <View style={styles.loginForm}>
      {loginError && (
        <View style={styles.loginError}>
          <Text style={{ color: "red" }}>{loginError}</Text>
        </View>
      )}
      <TextInput
        style={styles.loginInput}
        placeholder="email"
        placeholderTextColor="grey"
        value={formData.email}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        textContentType="emailAddress"
        onSubmitEditing={() => {
          passwordInputRef.current?.focus();
        }}
        blurOnSubmit={false}
        onChangeText={(email) => setFormData({ ...formData, email })}
      ></TextInput>
      <TextInput
        style={styles.loginInput}
        ref={passwordInputRef}
        placeholder="password"
        placeholderTextColor="grey"
        value={formData.password}
        clearButtonMode="while-editing"
        returnKeyType="done"
        textContentType="password"
        onChangeText={(password) => setFormData({ ...formData, password })}
        secureTextEntry
      ></TextInput>
      <Button onPress={handleSubmit}>
        <Text style={styles.loginButtonText}>Sign in</Text>
      </Button>
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
  loginError: {
    backgroundColor: "pink",
    paddingLeft: 10,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
