import { useFocusEffect, useNavigation } from "@react-navigation/core";
import * as React from "react";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { WorkoutLogItem } from "../components/WorkoutLogItem";
import {
  getWorkoutLogs,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";

export function WorkoutLogsScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getWorkoutLogs());
    }, [])
  );

  const workoutLogs: workoutLogHeaderData[] = useAppSelector(
    (state) => state.workoutLogs.data
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "right", "left"]}>
      <FlatList
        style={{ flex: 1 }}
        data={workoutLogs.map((workoutLog) => ({
          ...workoutLog,
          navigation,
        }))}
        keyExtractor={(workoutLog: workoutLogHeaderData) => workoutLog._id}
        renderItem={WorkoutLogItem}
      />
    </SafeAreaView>
  );
}
