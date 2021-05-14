import * as React from "react";
import { StyleSheet, Text } from "react-native";
import { exerciseData, workoutData } from "../slices/workoutsSlice";
import { Helvetica } from "../util/constants";
import { Table } from "./Table";

interface ExerciseTableProps {
  workout: workoutData;
  width?: number;
  weekPosition?: number;
}

export function ExerciseTable({ workout }: ExerciseTableProps) {
  return (
    <Table<exerciseData, JSX.Element>
      color="white"
      borderWidth={0.3}
      stripeColor="#dfe3eb"
      headerTextStyle={styles.headerRowText}
      headers={["Exercise", "Sets x reps", "Weight"]}
      data={workout.exercises}
      mapRowDataToCells={(exerciseData: exerciseData) => {
        return [
          <Text style={styles.cellText}>{exerciseData.name}</Text>,
          <Text style={styles.cellText}>
            {exerciseData.sets} x {exerciseData.repetitions}
          </Text>,
          <Text style={styles.cellText}>
            {exerciseData.weight} {exerciseData.unit}
          </Text>,
        ];
      }}
    />
  );
}

const styles = StyleSheet.create({
  headerRowText: {
    fontWeight: "bold",
    fontSize: 22,
    fontFamily: Helvetica,
  },
  cellText: {
    fontFamily: Helvetica,
    fontSize: 20,
  },
});
