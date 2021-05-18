import { useFocusEffect, useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { Table } from "../containers/Table";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import {
  exerciseLogData,
  getWorkoutLog,
  setLogData,
  workoutLogData,
} from "../slices/workoutLogsSlice";
import { renderRestInterval } from "../util/util";
import { LoadingScreen } from "./LoadingScreen";
import { DeviceOrientation, useOrientation } from "../util/hooks";
import { Helvetica } from "../util/constants";
import { ScrollView } from "react-native-gesture-handler";

type WorkoutLogScreenRouteProp = RouteProp<WorkoutLogStackParamList, "show">;
type tableSetLogData = setLogData & { name?: exerciseLogData["name"] };

export function WorkoutLogScreen() {
  const id: string = useRoute<WorkoutLogScreenRouteProp>().params.id;
  const workoutLog: workoutLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const dispatch = useAppDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getWorkoutLog(id));
    }, [id])
  );

  const orientation: DeviceOrientation = useOrientation();
  const tableHeaders = [
    "Exercise",
    "Reps",
    "Weight",
    orientation === DeviceOrientation.portrait ? "Rest" : "Rest Interval",
    orientation === DeviceOrientation.portrait ? "Video" : "Form Video",
  ];

  if (workoutLog._id !== id)
    return <LoadingScreen backgroundColor="lightyellow" />;

  return (
    <ScrollView style={styles.workoutLogScreen}>
      <Table
        stripeColor="#dfe3eb"
        headers={tableHeaders}
        headerTextStyle={{ fontWeight: "bold", fontSize: 18 }}
        borderWidth={0.2}
        data={mapExerciseLogDataToSetData(workoutLog.exercises)}
        color="white"
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
      {workoutLog.notes && (
        <View>
          <Text style={styles.workoutLogNotesText}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Notes:{"\n"}
            </Text>
            {workoutLog.notes}
          </Text>
        </View>
      )}
    </ScrollView>
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

const styles = StyleSheet.create({
  workoutLogScreen: {
    flex: 1,
    backgroundColor: "lightyellow",
  },
  workoutLogNotesText: {
    fontFamily: Helvetica,
    fontSize: 18,
    padding: 20,
  },
});
