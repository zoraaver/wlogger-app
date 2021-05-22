import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { useAppDispatch } from "..";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import {
  deleteWorkoutLog,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";
import { Button } from "./Button";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import {
  useHorizontalSwipeHandler,
  useSwipeableTapHandler,
  useVerticalCollapseTransition,
} from "../util/hooks";
import { AnimatedIonicon } from "./AnimatedIonicon";

interface WorkoutLogItemProps {
  workoutLog: workoutLogHeaderData;
}

const workoutLogItemInitialHeight = 80;
const maxDeleteButtonFontSize = 10;
const maxIconSize = 25;
const rightSnapPoint = -100;
const snapPoints: number[] = [rightSnapPoint, 0];

export function WorkoutLogItem({
  workoutLog: { createdAt, exerciseCount, setCount, _id },
}: WorkoutLogItemProps) {
  const logDate: string = new Date(createdAt).toDateString();

  const navigation = useNavigation<
    StackNavigationProp<WorkoutLogStackParamList>
  >();
  const dispatch = useAppDispatch();

  const { panGestureEventHandler, translateX } = useHorizontalSwipeHandler(
    snapPoints
  );

  const {
    animatedCollapseItemStyle,
    collapseTransition,
  } = useVerticalCollapseTransition(workoutLogItemInitialHeight, 300);

  const { tapGestureEventHandler, itemOpacity } = useSwipeableTapHandler(
    translateX,
    snapPoints,
    navigation.navigate,
    {
      name: "show",
      params: { id: _id, dateTitle: logDate },
    }
  );

  const animatedIconStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      translateX.value,
      [rightSnapPoint, 0],
      [maxIconSize, 0]
    ),
  }));

  const animatedLogHeaderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: itemOpacity.value,
  }));

  const animatedHiddenAreaStyle = useAnimatedStyle(() => ({
    width: interpolate(
      translateX.value,
      [rightSnapPoint, 0],
      [-rightSnapPoint, 0]
    ),
    opacity: interpolate(translateX.value, [rightSnapPoint, 0], [1, 0.5]),
  }));

  const animatedDeleteButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      translateX.value,
      [rightSnapPoint, 0],
      [maxDeleteButtonFontSize, 0]
    ),
  }));

  return (
    <Animated.View style={[styles.workoutLogItem, animatedCollapseItemStyle]}>
      <PanGestureHandler onGestureEvent={panGestureEventHandler} minDist={20}>
        <Animated.View style={styles.workoutLogItemTapArea}>
          <TapGestureHandler onGestureEvent={tapGestureEventHandler}>
            <Animated.View
              style={[styles.workoutLogHeader, animatedLogHeaderStyle]}
            >
              <Text style={styles.workoutLogItemText}>{logDate}</Text>
              <Text style={styles.workoutLogDetailsText}>
                {exerciseCount} exercise{exerciseCount === 1 ? ", " : "s, "}
                {setCount} set{setCount === 1 ? "" : "s"}
              </Text>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={animatedHiddenAreaStyle}>
        <Button
          onPress={() =>
            collapseTransition(() => {
              dispatch(deleteWorkoutLog(_id));
            }, 30)
          }
          style={styles.deleteButton}
          color="red"
        >
          <AnimatedIonicon
            name="trash"
            color="white"
            style={animatedIconStyle}
          />
          <Animated.Text
            style={[styles.deleteButtonText, animatedDeleteButtonTextStyle]}
          >
            Delete
          </Animated.Text>
        </Button>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  workoutLogHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  workoutLogItem: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  workoutLogItemTapArea: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "lightgrey",
  },
  workoutLogItemText: {
    fontSize: 20,
    fontFamily: Helvetica,
    fontWeight: "bold",
  },
  workoutLogDetailsText: {
    fontWeight: "300",
    fontFamily: Helvetica,
  },
  deleteButton: {
    borderRadius: 0,
    height: undefined,
    flex: 1,
  },
  deleteButtonText: {
    color: "white",
    fontFamily: Helvetica,
  },
});
