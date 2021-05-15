import { useFocusEffect } from "@react-navigation/core";
import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { WorkoutLogItem } from "../components/WorkoutLogItem";
import {
  getWorkoutLogs,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";
import { BalsamiqSans, infoColor } from "../util/constants";

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
    <>
      <SafeAreaView style={styles.topSafeAreaView} edges={["top"]} />
      <SafeAreaView
        style={styles.workoutLogsScreen}
        edges={["bottom", "right", "left"]}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Logs</Text>
        </View>
        <FlatList
          style={styles.workoutLogsList}
          data={workoutLogs}
          keyExtractor={(workoutLog: workoutLogHeaderData) => workoutLog._id}
          renderItem={WorkoutLogItem}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  topSafeAreaView: { backgroundColor: infoColor },
  workoutLogsScreen: { flex: 1 },
  header: { alignItems: "center", padding: 10, backgroundColor: infoColor },
  headerText: { fontSize: 25, fontFamily: BalsamiqSans },
  workoutLogsList: { flex: 1 },
});
