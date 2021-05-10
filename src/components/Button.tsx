import * as React from "react";
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { primaryColor } from "../util/constants";

interface ButtonProps {
  children: JSX.Element;
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
      style={{ ...styles.button, ...style, backgroundColor: color }}
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
