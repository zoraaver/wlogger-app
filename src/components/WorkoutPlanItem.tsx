import * as React from "react";
import { View } from "react-native";
import { StyleSheet, Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAppDispatch } from "..";
import {
  deleteWorkoutPlan,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import { Helvetica } from "../util/constants";
import {
  useHorizontalSwipeHandler,
  useVerticalCollapseTransition,
} from "../util/hooks";
import { AnimatedIonicon } from "./AnimatedIonicon";
import { Button } from "./Button";

interface WorkoutPlanItemProps {
  workoutPlan: workoutPlanHeaderData;
}

const rightMostSnapPoint = -100;
const snapPoints = [rightMostSnapPoint, 0];
const workoutPlanItemInitialHeight = 120;
const maxButtonFontSize = 15;
const maxIconSize = 30;

export function WorkoutPlanItem({ workoutPlan }: WorkoutPlanItemProps) {
  const dispatch = useAppDispatch();

  const { translateX, panGestureEventHandler } = useHorizontalSwipeHandler(
    snapPoints
  );

  const {
    animatedCollapseItemStyle,
    collapseTransition,
  } = useVerticalCollapseTransition(workoutPlanItemInitialHeight, 300);

  const animatedWorkoutPlanItemStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedHiddenAreaStyle = useAnimatedStyle(() => ({
    width: interpolate(
      translateX.value,
      [rightMostSnapPoint, 0],
      [-rightMostSnapPoint, 0]
    ),
  }));

  const animatedDeleteButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      translateX.value,
      [rightMostSnapPoint, 0],
      [maxButtonFontSize, 0]
    ),
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      translateX.value,
      [rightMostSnapPoint, 0],
      [maxIconSize, 0]
    ),
  }));

  function handleDelete() {
    collapseTransition(() => dispatch(deleteWorkoutPlan(workoutPlan._id)));
  }

  return (
    <Animated.View style={[styles.wrapper, animatedCollapseItemStyle]}>
      <PanGestureHandler onGestureEvent={panGestureEventHandler} minDist={20}>
        <Animated.View
          style={[styles.workoutPlanItem, animatedWorkoutPlanItemStyle]}
        >
          <WorkoutPlanDetails workoutPlan={workoutPlan} />
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={animatedHiddenAreaStyle}>
        <Button color="red" onPress={handleDelete} style={styles.deleteButton}>
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

interface WorkoutPlanDetailsProps {
  workoutPlan: workoutPlanHeaderData;
}

function WorkoutPlanDetails({ workoutPlan }: WorkoutPlanDetailsProps) {
  const startDate = workoutPlan.start
    ? new Date(workoutPlan.start).toDateString()
    : "-";
  const endDate = workoutPlan.end
    ? new Date(workoutPlan.end).toDateString()
    : "-";

  return (
    <>
      <Text style={styles.workoutPlanHeaderText}>{workoutPlan.name}</Text>
      <View>
        <Text style={styles.workoutPlanItemText}>
          <Text style={styles.workoutPlanFieldText}>Status:</Text>{" "}
          {workoutPlan.status}
        </Text>
        <Text style={styles.workoutPlanItemText}>
          <Text style={styles.workoutPlanFieldText}>Length:</Text>{" "}
          {workoutPlan.length} week
          {workoutPlan.length === 1 ? "" : "s"}
        </Text>
        <Text style={styles.workoutPlanItemText}>
          <Text style={styles.workoutPlanFieldText}>Start date:</Text>{" "}
          {startDate}
        </Text>
        <Text style={styles.workoutPlanItemText}>
          <Text style={styles.workoutPlanFieldText}>End date:</Text> {endDate}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    height: workoutPlanItemInitialHeight,
    justifyContent: "flex-end",
  },
  workoutPlanItem: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    ...StyleSheet.absoluteFillObject,
  },
  deleteButton: {
    flex: 1,
    height: undefined,
    borderRadius: 0,
  },
  deleteButtonText: {
    fontFamily: Helvetica,
    color: "white",
  },
  workoutPlanItemText: {
    fontFamily: Helvetica,
    fontWeight: "300",
    paddingVertical: 3,
  },
  workoutPlanHeaderText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: Helvetica,
  },
  workoutPlanFieldText: {
    fontWeight: "bold",
  },
});
