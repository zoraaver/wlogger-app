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

type HiddenAreaComponent = (
  translateX: Animated.SharedValue<number>,
  snapPoints: number[]
) => JSX.Element;

export enum SwipeDirection {
  left,
  right,
  any,
  none,
}

interface SwipeableProps {
  snapPoints: number[];
  rightArea?: HiddenAreaComponent;
  leftArea?: HiddenAreaComponent;
  children: React.ReactNode;
  onPress?: () => void;
  height?: number;
  mainAreaStyle?: ViewStyle;
  snapDuration?: number;
  swipeable?: boolean;
}

export function Swipeable({
  snapPoints,
  rightArea,
  leftArea,
  children,
  onPress,
  height,
  mainAreaStyle,
  snapDuration = 250,
  swipeable = true,
}: SwipeableProps) {
  let swipeDirection: SwipeDirection = SwipeDirection.none;

  if (rightArea && leftArea) {
    swipeDirection = SwipeDirection.any;
  } else if (rightArea) {
    swipeDirection = SwipeDirection.left;
  } else if (leftArea) {
    swipeDirection = SwipeDirection.right;
  }

  const { translateX, panGestureEventHandler } = useHorizontalSwipeHandler(
    snapPoints,
    snapDuration,
    swipeDirection,
    swipeable
  );

  const rightSnapPoint = snapPoints[0];
  const leftSnapPoint = snapPoints[snapPoints.length - 1];

  const animatedRightAreaStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        translateX.value,
        [rightSnapPoint, 0],
        [-rightSnapPoint, 0]
      ),
      opacity:
        translateX.value > 0
          ? 0
          : interpolate(translateX.value, [rightSnapPoint, 0], [1, 0.5]),
    };
  });

  const animatedLeftAreaStyle = useAnimatedStyle(() => ({
    width: interpolate(
      translateX.value,
      [0, leftSnapPoint],
      [0, leftSnapPoint]
    ),
    opacity: interpolate(translateX.value, [0, leftSnapPoint], [0.5, 1]),
  }));

  const animatedMainAreaStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[swipeableStyles.wrapper, { height }]}>
      {leftArea ? (
        <Animated.View
          style={[swipeableStyles.leftArea, animatedLeftAreaStyle]}
        >
          {leftArea(translateX, snapPoints)}
        </Animated.View>
      ) : null}
      <PanGestureHandler onGestureEvent={panGestureEventHandler} minDist={20}>
        <Animated.View
          style={[
            swipeableStyles.mainArea,
            { backgroundColor: onPress ? "lightgrey" : "white" },
            animatedMainAreaStyle,
          ]}
        >
          <SwipeableTapHandler
            onPress={onPress}
            snapPoints={snapPoints}
            translateX={translateX}
            style={mainAreaStyle}
          >
            {children}
          </SwipeableTapHandler>
        </Animated.View>
      </PanGestureHandler>
      {rightArea ? (
        <Animated.View
          style={[swipeableStyles.rightArea, animatedRightAreaStyle]}
        >
          {rightArea(translateX, snapPoints)}
        </Animated.View>
      ) : null}
    </View>
  );
}

function useHorizontalSwipeHandler(
  snapPoints: number[],
  duration: number,
  allowedSwipeDirections: SwipeDirection,
  swipeable: boolean
) {
  const translateX = useSharedValue(0);

  const panGestureEventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: ({ translationX }, ctx) => {
      if (!swipeable) return;
      const totalTranslationX = ctx.startX + translationX;
      switch (allowedSwipeDirections) {
        case SwipeDirection.any:
          translateX.value = totalTranslationX;
          break;
        case SwipeDirection.left:
          if (totalTranslationX <= 0) translateX.value = totalTranslationX;
          break;
        case SwipeDirection.right:
          if (totalTranslationX >= 0) translateX.value = totalTranslationX;
          break;
        case SwipeDirection.none:
          break;
      }
    },
    onEnd: ({ translationX, velocityX }) => {
      if (!swipeable) return;
      translateX.value = withTiming(
        findNearestSnapPoint(translationX, velocityX, snapPoints),
        { duration, easing: Easing.inOut(Easing.ease) }
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
          if (tapCallBack) {
            itemOpacity.value = 0.7;
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
    backgroundColor: "lightgrey",
  },
  mainArea: {
    backgroundColor: "white",
    flex: 1,
  },
  leftArea: {
    position: "absolute",
    left: 0,
    flexDirection: "row",
    height: "100%",
    flex: 1,
  },
  rightArea: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    flex: 1,
    height: "100%",
  },
});
