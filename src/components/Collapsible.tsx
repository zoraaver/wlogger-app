import * as React from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CollapsibleProps {
  children: React.ReactNode;
  initialHeight: number;
  duration?: number;
  collapsed: boolean;
  delay?: number;
  onCollapsed?: () => void;
}

export function Collapsible({
  children,
  initialHeight,
  duration = 300,
  delay,
  collapsed,
  onCollapsed,
}: CollapsibleProps) {
  const {
    animatedCollapseItemStyle,
    collapseTransition,
  } = useVerticalCollapseTransition(initialHeight, duration);

  React.useEffect(() => {
    if (collapsed) {
      collapseTransition(onCollapsed, delay);
    }
  }, [collapsed]);

  return (
    <Animated.View style={animatedCollapseItemStyle}>{children}</Animated.View>
  );
}

function useVerticalCollapseTransition(
  initialHeight: number,
  duration: number
) {
  const height = useSharedValue(initialHeight);

  const opacity = useDerivedValue(() => {
    return height.value / initialHeight;
  });

  const animatedCollapseItemStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  const collapseTransition = (
    callback?: (...args: any[]) => any,
    delay?: number
  ) => {
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
