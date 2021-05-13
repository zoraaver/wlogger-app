import * as React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Button as NativeButton,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { setSignupSuccess, signupUser } from "../slices/usersSlice";
import { Helvetica, successColor } from "../util/constants";
import { Button } from "./Button";

interface SignupModalProps {
  showSignupModal: boolean;
  setShowSignupModal: (showSignupModal: boolean) => void;
}
export function SignupModal({
  showSignupModal,
  setShowSignupModal,
}: SignupModalProps) {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const passwordInputRef: React.RefObject<TextInput> = React.useRef<TextInput>(
    null
  );
  const confirmPasswordInputRef: React.RefObject<TextInput> = React.useRef<TextInput>(
    null
  );
  const dispatch = useAppDispatch();
  const signupError = useAppSelector((state) => state.user.signupError);
  const signupSuccess = useAppSelector((state) => state.user.signupSuccess);

  function handleSubmit() {
    dispatch(signupUser(formData));
  }

  const signupAlert = () =>
    Alert.alert("Account created", signupSuccess, [
      {
        text: "Ok",
        onPress: () => {
          dispatch(setSignupSuccess(undefined));
          setShowSignupModal(false);
          setFormData({ email: "", password: "", confirmPassword: "" });
        },
      },
    ]);

  function errorBorder(fieldName: string) {
    return fieldName === signupError?.field
      ? { borderColor: "red", borderWidth: 1 }
      : {};
  }

  return (
    <Modal
      animationType="slide"
      visible={showSignupModal}
      onRequestClose={() => {
        setShowSignupModal(false);
      }}
      style={{ flex: 1 }}
    >
      {signupSuccess && signupAlert()}
      <SafeAreaView style={styles.signupModal}>
        <View style={styles.signupForm}>
          <View style={styles.backButton}>
            <NativeButton
              onPress={() => setShowSignupModal(false)}
              title="Back"
            />
          </View>
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
          <Button onPress={handleSubmit} color={successColor}>
            <Text style={styles.signupButtonText}>Sign up</Text>
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
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
