import { useNavigation } from "@react-navigation/core";
import * as React from "react";
import { View } from "react-native";
import { StyleSheet, Text } from "react-native";
import { useAppDispatch } from "..";
import { WorkoutPlanNavigation } from "../navigators/WorkoutPlanStackNavigator";
import {
  deleteWorkoutPlan,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import { Helvetica } from "../util/constants";
import { AnimatedSwipeButton } from "./AnimatedSwipeButton";
import { Collapsible } from "./Collapsible";
import { Swipeable } from "./Swipeable";

interface WorkoutPlanItemProps {
  workoutPlan: workoutPlanHeaderData;
}

const leftSnapPoint = -100;
const snapPoints = [leftSnapPoint, 0];

export function WorkoutPlanItem({ workoutPlan }: WorkoutPlanItemProps) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<WorkoutPlanNavigation>();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Collapsible
      collapsed={collapsed}
      onCollapsed={() => dispatch(deleteWorkoutPlan(workoutPlan._id))}
    >
      <Swipeable
        rightArea={(translateX) => (
          <AnimatedSwipeButton
            translateX={translateX}
            leftSnapPoint={leftSnapPoint}
            onPress={() => setCollapsed(true)}
            color="red"
            text="Delete"
            iconName="trash"
            maxTextFontSize={15}
            maxIconSize={30}
          />
        )}
        snapPoints={snapPoints}
        height={120}
        onPress={() => navigation.navigate("show", workoutPlan)}
        mainAreaStyle={styles.workoutPlanItem}
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

const styles = StyleSheet.create({
  workoutPlanItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
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
