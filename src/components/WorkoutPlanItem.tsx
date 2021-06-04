import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";
import { StyleSheet, Text } from "react-native";
import { useAppDispatch } from "..";
import { AuthenticatedNavigation } from "../navigators/AuthenticatedTabNavigator";
import {
  deleteWorkoutPlan,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import { Helvetica } from "../util/constants";
import { DDMMYYYYDateFormat } from "../util/util";
import { AnimatedSwipeButton } from "./AnimatedSwipeButton";
import { Collapsible } from "./Collapsible";
import { Swipeable } from "./Swipeable";

interface WorkoutPlanItemProps {
  workoutPlan: workoutPlanHeaderData;
  swipeable: boolean;
}

const leftSnapPoint = -100;
const snapPoints = [leftSnapPoint, 0];

export function WorkoutPlanItem({
  workoutPlan,
  swipeable,
}: WorkoutPlanItemProps) {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = React.useState(false);

  const navigation = useNavigation<AuthenticatedNavigation>();

  function handlePlanClick() {
    navigation.navigate("Plans", {
      screen: "show",
      params: {
        workoutPlanName: workoutPlan.name,
        id: workoutPlan._id,
      },
    });
  }

  return (
    <Collapsible
      collapsed={collapsed}
      onCollapsed={() => dispatch(deleteWorkoutPlan(workoutPlan._id))}
    >
      <Swipeable
        rightArea={(translateX) => (
          <AnimatedSwipeButton
            translateX={translateX}
            snapPoint={leftSnapPoint}
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
        onPress={handlePlanClick}
        mainAreaStyle={styles.workoutPlanItem}
        swipeable={swipeable}
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
          {workoutPlan.status === "Not started"
            ? "-"
            : DDMMYYYYDateFormat(workoutPlan.start)}
        </Text>
        <Text style={styles.workoutPlanItemText}>
          <Text style={styles.workoutPlanFieldText}>End date:</Text>{" "}
          {workoutPlan.status === "Completed"
            ? DDMMYYYYDateFormat(workoutPlan.end)
            : "-"}
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
    flex: 1,
    paddingLeft: 20,
  },
  workoutPlanFieldText: {
    fontWeight: "bold",
  },
  workoutPlanDetails: {
    height: "80%",
    justifyContent: "space-evenly",
    flex: 1,
    paddingLeft: 20,
  },
});
