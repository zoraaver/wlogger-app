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
import { Swipeable } from "./Swipeable";
import { Collapsible } from "./Collapsible";
import { AnimatedSwipeButton } from "./AnimatedSwipeButton";

interface WorkoutLogItemProps {
  workoutLog: workoutLogHeaderData;
}

const workoutLogItemInitialHeight = 80;
const leftSnapPoint = -100;
const snapPoints: number[] = [leftSnapPoint, 0];

export function WorkoutLogItem({
  workoutLog: { createdAt, exerciseCount, setCount, _id },
}: WorkoutLogItemProps) {
  const logDate: string = new Date(createdAt).toDateString();

  const navigation = useNavigation<
    StackNavigationProp<WorkoutLogStackParamList>
  >();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Collapsible
      collapsed={collapsed}
      onCollapsed={() => dispatch(deleteWorkoutLog(_id))}
    >
      <Swipeable
        snapPoints={snapPoints}
        height={workoutLogItemInitialHeight}
        rightArea={(translateX) => (
          <AnimatedSwipeButton
            translateX={translateX}
            onPress={() => setCollapsed(true)}
            leftSnapPoint={leftSnapPoint}
            color="red"
            text="Delete"
            iconName="trash"
          />
        )}
        mainAreaStyle={styles.workoutLogHeader}
        onPress={() =>
          navigation.navigate("show", { id: _id, dateTitle: logDate })
        }
      >
        <Text style={styles.workoutLogItemText}>{logDate}</Text>
        <Text style={styles.workoutLogDetailsText}>
          {exerciseCount} exercise{exerciseCount === 1 ? ", " : "s, "}
          {setCount} set{setCount === 1 ? "" : "s"}
        </Text>
      </Swipeable>
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  workoutLogHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
});
