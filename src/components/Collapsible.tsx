import * as React from "react";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CollapsibleProps {
  children: React.ReactNode;
  initialHeight: number;
  duration?: number;
  collapsed: boolean;
  onCollapsed?: () => void;
  onExpanded?: () => void;
}

export function Collapsible({
  children,
  initialHeight,
  duration = 300,
  collapsed,
  onCollapsed,
  onExpanded,
}: CollapsibleProps) {
  const {
    animatedCollapseItemStyle,
    collapseTransition,
    expandTransition,
  } = useVerticalCollapseTransition(initialHeight, duration);

  React.useEffect(() => {
    if (collapsed) {
      collapseTransition(onCollapsed);
    } else {
      expandTransition(onExpanded);
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

  const animatedCollapseItemStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(height.value, [0, initialHeight], [0, 1]),
  }));

  const collapseTransition = (callback?: (isFinished?: boolean) => void) => {
    height.value = withTiming(
      0,
      { duration, easing: Easing.inOut(Easing.ease) },
      (isFinished) => {
        if (callback) {
          runOnJS(callback)(isFinished);
        }
      }
    );
  };

  const expandTransition = (callback?: (isFinished: boolean) => void) => {
    height.value = withTiming(
      initialHeight,
      { duration, easing: Easing.inOut(Easing.ease) },
      (isFinished) => {
        if (callback) {
          runOnJS(callback)(isFinished);
        }
      }
    );
  };

  return { animatedCollapseItemStyle, collapseTransition, expandTransition };
}
