import * as React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { workoutLogHeaderData } from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";

interface WorkoutLogItemProps {
  item: workoutLogHeaderData;
}
export function WorkoutLogItem({
  item: { createdAt, exerciseCount, setCount },
}: WorkoutLogItemProps) {
  const logDate: Date = new Date(createdAt);
  return (
    <TouchableOpacity style={styles.workoutLogItem} activeOpacity={0.6}>
      <Text style={styles.workoutLogItemText}>
        <Text style={styles.workoutLogItemHeader}>
          {logDate.toDateString()}:
        </Text>{" "}
        {exerciseCount} exercise{exerciseCount === 1 ? ", " : "s, "}
        {setCount} set{setCount === 1 ? "" : "s"}
      </Text>
    </TouchableOpacity>
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
    minHeight: 40,
  },
  workoutLogItemText: {
    fontSize: 20,
    fontFamily: Helvetica,
    fontWeight: "300",
  },
  workoutLogItemHeader: { fontWeight: "normal" },
});
