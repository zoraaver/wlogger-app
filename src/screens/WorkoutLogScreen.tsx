import { useFocusEffect, useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import { getWorkoutLog, workoutLogData } from "../slices/workoutLogsSlice";
import { LoadingScreen } from "./LoadingScreen";
import { Helvetica } from "../util/constants";
import { ScrollView } from "react-native-gesture-handler";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";

type WorkoutLogScreenRouteProp = RouteProp<WorkoutLogStackParamList, "show">;

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

  if (workoutLog._id !== id)
    return <LoadingScreen backgroundColor="lightyellow" />;

  return (
    <ScrollView style={styles.workoutLogScreen}>
      <WorkoutLogTable workoutLog={workoutLog} />
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
