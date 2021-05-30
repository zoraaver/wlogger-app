import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { View } from "react-native";
import { StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAppDispatch } from "..";
import { WorkoutPlanStackParamList } from "../navigators/WorkoutPlanStackNavigator";
import {
  deleteWorkoutPlan,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import { Helvetica } from "../util/constants";
import { AnimatedIonicon } from "./AnimatedIonicon";
import { Button } from "./Button";
import { Collapsible } from "./Collapsible";
import { Swipeable } from "./Swipeable";

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
  const navigation = useNavigation<
    StackNavigationProp<WorkoutPlanStackParamList>
  >();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Collapsible
      collapsed={collapsed}
      initialHeight={workoutPlanItemInitialHeight}
      onCollapsed={() => dispatch(deleteWorkoutPlan(workoutPlan._id))}
    >
      <Swipeable
        rightArea={(translateX) => (
          <WorkoutPlanItemDeleteButton
            translateX={translateX}
            handleDelete={() => setCollapsed(true)}
          />
        )}
        snapPoints={snapPoints}
        onPress={() => navigation.navigate("show", workoutPlan)}
        mainAreaStyle={styles.workoutPlanItemTapArea}
      >
        <WorkoutPlanDetails workoutPlan={workoutPlan} />
      </Swipeable>
    </Collapsible>
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
      <View style={styles.workoutPlanDetails}>
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

interface WorkoutPlanItemDeleteButton {
  translateX: Animated.SharedValue<number>;
  handleDelete: () => void;
}

function WorkoutPlanItemDeleteButton({
  translateX,
  handleDelete,
}: WorkoutPlanItemDeleteButton) {
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

  return (
    <Button color="red" onPress={handleDelete} style={styles.deleteButton}>
      <AnimatedIonicon name="trash" color="white" style={animatedIconStyle} />
      <Animated.Text
        style={[styles.deleteButtonText, animatedDeleteButtonTextStyle]}
      >
        Delete
      </Animated.Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  workoutPlanItemTapArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
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
  },
  workoutPlanHeaderText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: Helvetica,
  },
  workoutPlanFieldText: {
    fontWeight: "bold",
  },
  workoutPlanDetails: {
    height: "80%",
    justifyContent: "space-evenly",
  },
});
