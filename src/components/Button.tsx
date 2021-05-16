import * as React from "react";
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { primaryColor } from "../util/constants";

interface ButtonProps {
  children: React.ReactNode;
  color?: string;
  onPress: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
  style?: any;
}

export function Button({
  children,
  color = primaryColor,
  onPress,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
