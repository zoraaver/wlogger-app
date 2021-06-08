import * as React from "react";
import { ActivityIndicator, StyleProp } from "react-native";
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { primaryColor } from "../util/constants";

interface ButtonProps {
  children: React.ReactNode;
  color?: string;
  onPress: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  color = primaryColor,
  onPress,
  style,
  disabled,
  loading,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? <ActivityIndicator size="small" color="white" /> : children}
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
