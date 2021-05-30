import * as React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  TapGestureHandler,
  PanGestureHandler,
  TapGestureHandlerGestureEvent,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { findNearestSnapPoint, includes } from "../util/worklets";

interface SwipeableProps {
  snapPoints: number[];
  rightArea: (
    translateX: Animated.SharedValue<number>,
    snapPoints: number[]
  ) => JSX.Element;
  children: React.ReactNode;
  onPress?: () => void;
  height?: number;
  mainAreaStyle?: ViewStyle;
}

export function Swipeable({
  snapPoints,
  rightArea,
  children,
  onPress,
  height,
  mainAreaStyle,
}: SwipeableProps) {
  const { translateX, panGestureEventHandler } = useHorizontalSwipeHandler(
    snapPoints
  );
  const rightSnapPoint = snapPoints[0];

  const animatedRightAreaStyle = useAnimatedStyle(() => ({
    width: interpolate(
      translateX.value,
      [rightSnapPoint, 0],
      [-rightSnapPoint, 0]
    ),
    opacity: interpolate(translateX.value, [rightSnapPoint, 0], [1, 0.5]),
  }));

  const animatedMainAreaStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[swipeableStyles.wrapper, { height }]}>
      <PanGestureHandler onGestureEvent={panGestureEventHandler}>
        <Animated.View
          style={[
            swipeableStyles.mainArea,
            { backgroundColor: onPress ? "lightgrey" : "white" },
            onPress ? undefined : mainAreaStyle,
            animatedMainAreaStyle,
          ]}
        >
          {onPress ? (
            <SwipeableTapHandler
              onPress={onPress}
              snapPoints={snapPoints}
              translateX={translateX}
              style={mainAreaStyle}
            >
              {children}
            </SwipeableTapHandler>
          ) : (
            children
          )}
        </Animated.View>
      </PanGestureHandler>
      <Animated.View
        style={[swipeableStyles.rightArea, animatedRightAreaStyle]}
      >
        {rightArea(translateX, snapPoints)}
      </Animated.View>
    </View>
  );
}

function useHorizontalSwipeHandler(snapPoints: number[]) {
  const translateX = useSharedValue(0);

  const panGestureEventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startingTranslateX: number }
  >({
    onStart: ({ translationX }, { startingTranslateX }) => {
      startingTranslateX = translationX;
    },
    onActive: ({ translationX }, { startingTranslateX }) => {
      if (translationX + startingTranslateX <= 0) {
        translateX.value = translationX + startingTranslateX;
      }
    },
    onEnd: ({ translationX, velocityX }) => {
      translateX.value = withTiming(
        findNearestSnapPoint(translationX, velocityX, snapPoints),
        { easing: Easing.inOut(Easing.ease) }
      );
    },
  });
  return { panGestureEventHandler, translateX };
}

interface SwipeableTapHandlerProps {
  translateX: Animated.SharedValue<number>;
  snapPoints: number[];
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

type itemOpacity = 0 | 0.7 | 1;

function SwipeableTapHandler({
  translateX,
  snapPoints,
  onPress,
  children,
  style,
}: SwipeableTapHandlerProps) {
  const { tapGestureEventHandler, itemOpacity } = useSwipeableTapHandler(
    translateX,
    snapPoints,
    onPress
  );

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: itemOpacity.value,
  }));

  return (
    <TapGestureHandler onGestureEvent={tapGestureEventHandler}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </TapGestureHandler>
  );
}

function useSwipeableTapHandler(
  translateX: Animated.SharedValue<number>,
  snapPoints: number[],
  tapCallBack?: () => void
) {
  const itemOpacity = useSharedValue<itemOpacity>(1);
  const tapGestureEventHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>(
    {
      onFail: () => {
        itemOpacity.value = 1;
      },
      onCancel: () => {
        itemOpacity.value = 1;
      },
      onEnd: () => {
        if (translateX.value !== 0 && includes(snapPoints, translateX.value)) {
          translateX.value = withTiming(0);
        } else {
          itemOpacity.value = 0.7;
          if (tapCallBack) {
            runOnJS(tapCallBack)();
          }
        }
      },
      onFinish: () => {
        itemOpacity.value = withDelay(100, withTiming(1)) as 1;
      },
    }
  );
  return { tapGestureEventHandler, itemOpacity };
}

const swipeableStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "lightgrey",
  },
  mainArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  rightArea: {
    flexDirection: "row",
  },
});
