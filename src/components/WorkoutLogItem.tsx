import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { HomeTabParamList } from "../navigators/HomeTabNavigator";
import { workoutLogHeaderData } from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";

interface WorkoutLogItemProps {
  item: workoutLogHeaderData & {
    navigation: BottomTabNavigationProp<HomeTabParamList>;
  };
}
export function WorkoutLogItem({
  item: { createdAt, exerciseCount, setCount, navigation, _id },
}: WorkoutLogItemProps) {
  const logDate: Date = new Date(createdAt);

  return (
    <Swipeable
      maxPointers={1}
      renderRightActions={renderRightActions}
      friction={1.5}
      overshootFriction={8}
      useNativeAnimations
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Logs", { screen: "show", params: { id: _id } })
        }
        style={styles.workoutLogItem}
        activeOpacity={0.6}
      >
        <Text style={styles.workoutLogItemText}>
          <Text style={styles.workoutLogItemHeader}>
            {logDate.toDateString()}:
          </Text>{" "}
          {exerciseCount} exercise{exerciseCount === 1 ? ", " : "s, "}
          {setCount} set{setCount === 1 ? "" : "s"}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
}

function renderRightActions(
  progressAnimatedValue: Animated.AnimatedInterpolation,
  dragAnimatedValue: Animated.AnimatedInterpolation
): React.ReactNode {
  return (
    <RectButton onPress={() => {}} style={[styles.deleteButton]}>
      <Text style={styles.deleteButtonText} accessible>
        Delete
      </Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  workoutLogItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.2,
    backgroundColor: "white",
    borderBottomColor: "grey",
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 20,
    fontFamily: Helvetica,
  },
});
