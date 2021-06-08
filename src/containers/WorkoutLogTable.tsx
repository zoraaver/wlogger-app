import * as React from "react";
import { StyleSheet, Text } from "react-native";
import {
  exerciseLogData,
  setLogData,
  workoutLogData,
} from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";
import { DeviceOrientation, useOrientation } from "../util/hooks";
import { renderRestInterval } from "../util/util";
import { Table, MergeCell } from "./Table";

type tableSetLogData = setLogData & {
  name?: exerciseLogData["name"];
  setIndex: number;
  exerciseIndex: number;
};

interface WorkoutLogTableProps {
  workoutLog: workoutLogData;
  onRowPress?: (exerciseIndex: number, setIndex: number) => void;
}

export function WorkoutLogTable({
  workoutLog,
  onRowPress,
}: WorkoutLogTableProps) {
  const orientation: DeviceOrientation = useOrientation();
  const tableHeaders = [
    "Exercise",
    "Reps",
    "Weight",
    orientation === DeviceOrientation.portrait ? "Rest" : "Rest Interval",
  ];

  return (
    <Table
      stripeColor="#dfe3eb"
      headers={tableHeaders}
      headerTextStyle={{ fontWeight: "bold", fontSize: 18 }}
      borderWidth={0.2}
      data={mapExerciseLogDataToSetData(workoutLog.exercises)}
      color="white"
      mergeCell={(rowIndex, cellIndex, tableData) => {
        if (cellIndex === 0 && !tableData[rowIndex].name) {
          return MergeCell.top;
        }
      }}
      mapRowDataToCells={(setData: tableSetLogData) =>
        [
          setData.name,
          setData.repetitions,
          `${setData.weight} ${setData.unit}`,
          renderRestInterval(setData.restInterval),
        ].map((text) => <Text style={styles.cellText}>{text}</Text>)
      }
      onRowPress={
        onRowPress
          ? (rowData: tableSetLogData) =>
              onRowPress(rowData.exerciseIndex, rowData.setIndex)
          : undefined
      }
      rowKeyExtractor={(rowData) => (rowData._id || rowData.tempId) as string}
    />
  );
}

function mapExerciseLogDataToSetData(
  data: exerciseLogData[]
): Array<tableSetLogData> {
  const sets: tableSetLogData[][] = data.map(
    (logData: exerciseLogData, exerciseIndex: number) =>
      logData.sets.map((set: setLogData, setIndex: number) => {
        if (setIndex === 0) {
          return { ...set, setIndex, exerciseIndex, name: logData.name };
        } else {
          return { ...set, setIndex, exerciseIndex };
        }
      })
  );
  return sets.flat();
}

const styles = StyleSheet.create({
  cellText: { fontFamily: Helvetica, fontSize: 18 },
});
