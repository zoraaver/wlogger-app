import * as React from "react";
import { StyleSheet, Text } from "react-native";
import { exerciseData, workoutData } from "../slices/workoutsSlice";
import { Helvetica } from "../util/constants";
import { Table } from "./Table";

interface ExerciseTableProps {
  workout: workoutData;
  editButton?: (exerciseIndex: number) => JSX.Element;
}

export function ExerciseTable({ workout, editButton }: ExerciseTableProps) {
  return (
    <Table
      color="white"
      borderWidth={0.3}
      stripeColor="#dfe3eb"
      headerTextStyle={styles.headerRowText}
      headers={["Exercise", "Sets x reps", "Weight"].concat(
        editButton ? [""] : []
      )}
      data={workout.exercises}
      mapRowDataToCells={(
        exerciseData: exerciseData,
        exerciseIndex: number
      ) => {
        return [
          exerciseData.name,
          `${exerciseData.sets} x ${exerciseData.repetitions}`,
          `${exerciseData.weight} ${exerciseData.unit}`,
        ]
          .map((cellText) => <Text style={styles.cellText}>{cellText}</Text>)
          .concat(editButton ? [editButton(exerciseIndex)] : []);
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
