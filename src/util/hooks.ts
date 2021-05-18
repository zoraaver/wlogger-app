import { useWindowDimensions } from "react-native";

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
