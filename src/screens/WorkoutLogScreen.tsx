import { useFocusEffect, useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import * as React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import { getWorkoutLog, workoutLogData } from "../slices/workoutLogsSlice";

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

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1 }}>
      <Text>{workoutLog._id}</Text>
    </SafeAreaView>
  );
}
