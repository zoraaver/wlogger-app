import * as React from "react";
import { Text } from "react-native";
import {
  exerciseLogData,
  setLogData,
  workoutLogData,
} from "../slices/workoutLogsSlice";
import { DeviceOrientation, useOrientation } from "../util/hooks";
import { renderRestInterval } from "../util/util";
import { Table, MergeCell } from "./Table";

type tableSetLogData = setLogData & { name?: exerciseLogData["name"] };

interface WorkoutLogTableProps {
  workoutLog: workoutLogData;
}

export function WorkoutLogTable({ workoutLog }: WorkoutLogTableProps) {
  const orientation: DeviceOrientation = useOrientation();
  const tableHeaders = [
    "Exercise",
    "Reps",
    "Weight",
    orientation === DeviceOrientation.portrait ? "Rest" : "Rest Interval",
    orientation === DeviceOrientation.portrait ? "Video" : "Form Video",
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
      mapRowDataToCells={(setData: tableSetLogData) => [
        <Text>{setData.name}</Text>,
        <Text>{setData.repetitions}</Text>,
        <Text>
          {setData.weight} {setData.unit}
        </Text>,
        <Text>{renderRestInterval(setData.restInterval)}</Text>,
        <Text>
          {setData.formVideoExtension ? setData.formVideoExtension : "-"}
        </Text>,
      ]}
    />
  );
}

function mapExerciseLogDataToSetData(
  data: exerciseLogData[]
): Array<tableSetLogData> {
  const sets: tableSetLogData[][] = data.map((logData: exerciseLogData) =>
    logData.sets.length > 0
      ? [{ ...logData.sets[0], name: logData.name }, ...logData.sets.slice(1)]
      : []
  );
  return sets.flat();
}
