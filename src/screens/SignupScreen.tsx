import * as React from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import {
  setSignupError,
  setSignupSuccess,
  signupUser,
} from "../slices/usersSlice";
import { Helvetica, successColor } from "../util/constants";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/core";
import { UnauthenticatedNavigation } from "../navigators/UnauthenticatedStackNavigator";
import { DismissKeyboard } from "../components/DismissKeyboard";

const initialFormData = { email: "", password: "", confirmPassword: "" };

export function SignupScreen() {
  const [formData, setFormData] = React.useState(initialFormData);

  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  const dispatch = useAppDispatch();

  const signupError = useAppSelector((state) => state.user.signupError);
  const signupSuccess = useAppSelector((state) => state.user.signupSuccess);
  const postUserPending = useAppSelector((state) => state.user.postUserPending);

  const navigation = useNavigation<UnauthenticatedNavigation>();

  React.useEffect(() => {
    return () => {
      dispatch(setSignupError());
    };
  }, []);

  React.useEffect(() => {
    if (signupSuccess) {
      signupAlert();
    }
  }, [signupSuccess]);

  function signupAlert() {
    Alert.alert("Account created", signupSuccess, [
      {
        text: "Ok",
        onPress: () => {
          dispatch(setSignupSuccess(undefined));
          navigation.navigate("login");
          setFormData({ email: "", password: "", confirmPassword: "" });
        },
      },
    ]);
  }

  function errorBorder(fieldName: string) {
    return fieldName === signupError?.field
      ? { borderColor: "red", borderWidth: 1 }
      : {};
  }

  return (
    <DismissKeyboard>
      <View style={styles.signupModal}>
        <View style={styles.signupForm}>
          <TextInput
            style={{ ...styles.signupInput, ...errorBorder("email") }}
            placeholder="email"
            placeholderTextColor="grey"
            value={formData.email}
            clearButtonMode="while-editing"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            textContentType="emailAddress"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={false}
            onChangeText={(email) => {
              setFormData({ ...formData, email });
            }}
          ></TextInput>
          {signupError?.field === "email" && (
            <View>
              <Text>{signupError?.error}</Text>
            </View>
          )}
          <TextInput
            style={{ ...styles.signupInput, ...errorBorder("password") }}
            placeholder="password"
            ref={passwordInputRef}
            placeholderTextColor="grey"
            value={formData.password}
            secureTextEntry
            clearButtonMode="while-editing"
            returnKeyType="next"
            textContentType="newPassword"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            blurOnSubmit={false}
            onChangeText={(password) => {
              setFormData({ ...formData, password });
            }}
          ></TextInput>
          {signupError?.field === "password" && (
            <View>
              <Text>{signupError?.error}</Text>
            </View>
          )}
          <TextInput
            style={{ ...styles.signupInput, ...errorBorder("confirmPassword") }}
            placeholder="confirm password"
            placeholderTextColor="grey"
            value={formData.confirmPassword}
            ref={confirmPasswordInputRef}
            secureTextEntry
            clearButtonMode="while-editing"
            textContentType="newPassword"
            returnKeyType="join"
            onChangeText={(confirmPassword) => {
              setFormData({ ...formData, confirmPassword });
            }}
          ></TextInput>
          {signupError?.field === "confirmPassword" && (
            <View>
              <Text>{signupError?.error}</Text>
            </View>
          )}
          <Button
            onPress={() => {
              dispatch(signupUser(formData));
            }}
            color={successColor}
            loading={postUserPending}
            disabled={postUserPending}
          >
            <Text style={styles.signupButtonText}>Sign up</Text>
          </Button>
        </View>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  signupModal: {
    backgroundColor: "powderblue",
    flex: 1,
  },
  signupForm: {
    justifyContent: "space-around",
    minHeight: 280,
    paddingHorizontal: 20,
  },
  signupButtonText: { color: "white", fontFamily: Helvetica, fontSize: 18 },
  signupInput: {
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 10,
  },
  backButton: {
    alignSelf: "flex-start",
  },
});
