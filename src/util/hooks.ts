import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import {
  Keyboard,
  KeyboardEventListener,
  KeyboardEventName,
  useWindowDimensions,
} from "react-native";

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

export function useHideTabBarInNestedStack(hideTabBar?: boolean) {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      if (hideTabBar) {
        navigation.dangerouslyGetParent()?.setOptions({ tabBarVisible: false });
        return () =>
          navigation
            .dangerouslyGetParent()
            ?.setOptions({ tabBarVisible: true });
      }
    }, [hideTabBar])
  );
}

export function useInterval(
  callback: () => void,
  delayInMilliSeconds?: number
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayInMilliSeconds !== undefined) {
      function tick() {
        savedCallback.current();
      }
      const intervalId = setInterval(tick, delayInMilliSeconds);
      return () => clearInterval(intervalId);
    }
  }, [delayInMilliSeconds]);
}
