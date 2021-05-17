import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import {
  Text,
  StyleSheet,
  TouchableHighlight,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useAppDispatch } from "..";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import {
  deleteWorkoutLog,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";
import { Button } from "./Button";
import Ionicon from "react-native-vector-icons/Ionicons";

interface WorkoutLogItemProps {
  workoutLog: workoutLogHeaderData;
}
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function WorkoutLogItem({
  workoutLog: { createdAt, exerciseCount, setCount, _id },
}: WorkoutLogItemProps) {
  const logDate: Date = new Date(createdAt);
  const navigation = useNavigation<
    StackNavigationProp<WorkoutLogStackParamList>
  >();

  return (
    <Swipeable
      maxPointers={1}
      renderRightActions={() => <RenderRightActions id={_id} />}
      friction={1}
      overshootFriction={8}
      rightThreshold={-50}
    >
      <TouchableHighlight
        onPress={() => navigation.navigate("show", { id: _id })}
        delayPressIn={45}
        style={styles.workoutLogItem}
        activeOpacity={0.8}
        underlayColor="lightgrey"
      >
        <Text style={styles.workoutLogItemText}>
          <Text style={styles.workoutLogItemHeader}>
            {logDate.toDateString()}:
          </Text>{" "}
          {exerciseCount} exercise{exerciseCount === 1 ? ", " : "s, "}
          {setCount} set{setCount === 1 ? "" : "s"}
        </Text>
      </TouchableHighlight>
    </Swipeable>
  );
}

export function RenderRightActions({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  return (
    <Button
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        dispatch(deleteWorkoutLog(id));
      }}
      style={styles.deleteButton}
      color="red"
    >
      <Ionicon name="trash" size={25} color="white" />
      <Text style={styles.deleteButtonText} accessible>
        Delete
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  workoutLogItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  workoutLogItemText: {
    fontSize: 20,
    fontFamily: Helvetica,
    fontWeight: "300",
    marginVertical: 15,
  },
  workoutLogItemHeader: { fontWeight: "normal" },
  deleteButton: {
    minWidth: 100,
    height: undefined,
    borderRadius: 0,
    padding: 10,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 10,
    fontFamily: Helvetica,
  },
});
