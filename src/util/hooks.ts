import { useEffect } from "react";
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
  });
}
