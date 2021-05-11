import * as React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

interface DismissKeyboardProps {
  children: JSX.Element | JSX.Element[];
}

export function DismissKeyboard({ children }: DismissKeyboardProps) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
}
