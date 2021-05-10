import * as React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Button as NativeButton,
  Alert,
} from "react-native";
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

  function SignupInput(
    fieldName: string,
    fieldValue: string,
    secureTextEntry: boolean = false
  ): JSX.Element {
    const errorField = signupError?.field;
    const errorBorder =
      fieldName === errorField ? { borderColor: "red", borderWidth: 1 } : {};
    return (
      <React.Fragment key={fieldName}>
        <TextInput
          style={{ ...styles.signupInput, ...errorBorder }}
          placeholder={
            fieldName === "confirmPassword" ? "confirm password" : fieldName
          }
          placeholderTextColor="grey"
          value={fieldValue}
          secureTextEntry={secureTextEntry}
          onChangeText={(newValue) => {
            setFormData({ ...formData, [fieldName]: newValue });
          }}
        ></TextInput>
        {errorField === fieldName && (
          <View>
            <Text>{signupError?.error}</Text>
          </View>
        )}
      </React.Fragment>
    );
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
          {[
            SignupInput("email", formData.email),
            SignupInput("password", formData.password, true),
            SignupInput("confirmPassword", formData.confirmPassword, true),
          ]}
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
