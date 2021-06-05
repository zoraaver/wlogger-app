import { useFocusEffect } from "@react-navigation/core";
import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { HorizontalDivider } from "../components/HorizontalDivider";
import { WorkoutLogItem } from "../components/WorkoutLogItem";
import {
  getWorkoutLogs,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";

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

  const dataPending = useAppSelector((state) => state.workoutLogs.dataPending);

  return (
    <View style={styles.workoutLogsScreen}>
      {dataPending && !workoutLogs.length ? (
        <ActivityIndicator size="large" color="grey" />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={workoutLogs}
          keyExtractor={(workoutLog: workoutLogHeaderData) => workoutLog._id}
          renderItem={(data) => <WorkoutLogItem workoutLog={data.item} />}
          ItemSeparatorComponent={() => <HorizontalDivider />}
          ListFooterComponent={() => <HorizontalDivider />}
          ListEmptyComponent={() => (
            <View style={styles.emptyListView}>
              <Text style={styles.emptyListText}>No logs found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  workoutLogsScreen: {
    flex: 1,
    backgroundColor: "lightyellow",
    justifyContent: "center",
  },
  emptyListView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "aliceblue",
    height: 50,
  },
  emptyListText: {
    fontSize: 20,
    fontFamily: Helvetica,
  },
});
