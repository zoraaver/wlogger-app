import { useEffect } from "react";
import {
  Keyboard,
  KeyboardEventListener,
  KeyboardEventName,
  useWindowDimensions,
} from "react-native";
import {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { findNearestSnapPoint } from "./worklets";

export enum DeviceOrientation {
  portrait,
  landscape,
}

export function useOrientation(): DeviceOrientation {
  const { height, width } = useWindowDimensions();
  return height > width
    ? DeviceOrientation.portrait
    : DeviceOrientation.landscape;
}

export function useKeyboard(
  event: KeyboardEventName,
  listener: KeyboardEventListener
): void {
  useEffect(() => {
    Keyboard.addListener(event, listener);
    return () => {
      Keyboard.removeListener(event, listener);
    };
  }, []);
}

export function useHorizontalSwipeHandler(snapPoints: number[]) {
  const translateX = useSharedValue(0);
  const absoluteTranslateX = useDerivedValue(() => Math.abs(translateX.value));
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
  return { panGestureEventHandler, translateX, absoluteTranslateX };
}

export function useVerticalCollapseTransition(
  initialHeight: number,
  duration: number,
  callback?: (...args: any[]) => any,
  delay?: number
) {
  const height = useSharedValue(initialHeight);

  const opacity = useDerivedValue(() => {
    return height.value / initialHeight;
  });

  const animatedCollapseItemStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  const collapseTransition = () => {
    height.value = withTiming(0, {
      duration,
      easing: Easing.inOut(Easing.ease),
    });
    if (callback) {
      setTimeout(callback, duration + (delay ?? 0));
    }
  };

  return { animatedCollapseItemStyle, collapseTransition, height };
}

type itemOpacity = 0 | 0.7 | 1;

export function useSwipeableTapHandler<TapCallBackArgs>(
  translateX: Animated.SharedValue<number>,
  snapPoints: number[],
  tapCallBack?: (args: TapCallBackArgs) => any,
  tapCallBackArguments?: TapCallBackArgs
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
        if (translateX.value !== 0 && snapPoints.includes(translateX.value)) {
          translateX.value = withTiming(0);
        } else {
          itemOpacity.value = 0.7;
          if (tapCallBack && tapCallBackArguments) {
            runOnJS(tapCallBack)(tapCallBackArguments);
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
