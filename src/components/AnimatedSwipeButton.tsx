import * as React from "react";
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Helvetica } from "../util/constants";

const AnimatedIonicon = Animated.createAnimatedComponent(Ionicon);

interface AnimatedSwipeButtonProps {
  translateX: Animated.SharedValue<number>;
  snapPoint: number;
  onPress?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  iconName?: string;
  textStyle?: StyleProp<TextStyle>;
  maxIconSize?: number;
  maxTextFontSize?: number;
  text?: string;
  iconColor?: string;
}

export function AnimatedSwipeButton({
  onPress,
  color,
  style,
  textStyle,
  iconName,
  translateX,
  maxIconSize = 25,
  maxTextFontSize = 10,
  iconColor = "white",
  text,
  snapPoint,
}: AnimatedSwipeButtonProps) {
  let sizeExtrapolation: {
    extrapolateLeft?: Animated.Extrapolate;
    extrapolateRight?: Animated.Extrapolate;
  } = {};

  sizeExtrapolation.extrapolateLeft = Extrapolate.CLAMP;
  const inputRange = [snapPoint, 0];
  const iconSizeOutputRange = [maxIconSize, 0];
  const textFontSizeRange = [maxTextFontSize, 0];

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        translateX.value,
        inputRange,
        iconSizeOutputRange,
        sizeExtrapolation
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      translateX.value,
      inputRange,
      textFontSizeRange,
      sizeExtrapolation
    ),
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }, style]}
      activeOpacity={0.7}
    >
      {iconName ? (
        <AnimatedIonicon
          name={iconName}
          color={iconColor}
          style={animatedIconStyle}
        />
      ) : null}
      <Animated.Text style={[styles.buttonText, textStyle, animatedTextStyle]}>
        {text}
      </Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonText: { fontFamily: Helvetica, color: "white" },
});
