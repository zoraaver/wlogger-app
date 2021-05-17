import { useFocusEffect } from "@react-navigation/core";
import * as React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { HorizontalDivider } from "../components/HorizontalDivider";
import { WorkoutLogItem } from "../components/WorkoutLogItem";
import {
  getWorkoutLogs,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";

export function WorkoutLogsScreen() {
  const dispatch = useAppDispatch();

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
        data={workoutLogs}
        keyExtractor={(workoutLog: workoutLogHeaderData) => workoutLog._id}
        renderItem={(data) => <WorkoutLogItem workoutLog={data.item} />}
        ItemSeparatorComponent={() => (
          <HorizontalDivider backgroundColor="lightgrey" />
        )}
      />
    </SafeAreaView>
  );
}
