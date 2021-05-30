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
import { AnimatedIonicon } from "./AnimatedIonicon";
import { Swipeable } from "./Swipeable";
import { Collapsible } from "./Collapsible";

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
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Collapsible
      collapsed={collapsed}
      initialHeight={workoutLogItemInitialHeight}
      onCollapsed={() => dispatch(deleteWorkoutLog(_id))}
      delay={30}
    >
      <Swipeable
        snapPoints={snapPoints}
        rightArea={(translateX) => (
          <WorkoutLogItemDeleteButton
            translateX={translateX}
            handleDelete={() => setCollapsed(true)}
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

interface WorkoutLogItemDeleteButtonProps {
  translateX: Animated.SharedValue<number>;
  handleDelete: () => void;
}

function WorkoutLogItemDeleteButton({
  translateX,
  handleDelete,
}: WorkoutLogItemDeleteButtonProps) {
  const animatedIconStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      translateX.value,
      [rightSnapPoint, 0],
      [maxIconSize, 0]
    ),
  }));

  const animatedDeleteButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      translateX.value,
      [rightSnapPoint, 0],
      [maxDeleteButtonFontSize, 0]
    ),
  }));

  return (
    <Button onPress={handleDelete} style={styles.deleteButton} color="red">
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
