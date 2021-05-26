import { useFocusEffect, useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import {
  deleteSetVideo,
  getWorkoutLog,
  videoSetsSelector,
  workoutLogData,
} from "../slices/workoutLogsSlice";
import { LoadingScreen } from "./LoadingScreen";
import { Helvetica } from "../util/constants";
import { ScrollView } from "react-native-gesture-handler";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { WorkoutLogVideoRow } from "../components/WorkoutLogVideoRow";

type WorkoutLogScreenRouteProp = RouteProp<WorkoutLogStackParamList, "show">;

export function WorkoutLogScreen() {
  const id: string = useRoute<WorkoutLogScreenRouteProp>().params.id;
  const workoutLog: workoutLogData = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const setsWithVideos = useAppSelector(videoSetsSelector);
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
      {setsWithVideos.length ? (
        <View style={styles.videoArea}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoHeaderText}>Form videos</Text>
          </View>
          {setsWithVideos.map((set) => (
            <WorkoutLogVideoRow
              set={set}
              key={set._id}
              showDownload
              deleteVideo={() =>
                dispatch(
                  deleteSetVideo({
                    workoutLogId: set.workoutLogId as string,
                    setId: set._id as string,
                    exerciseId: set.exerciseId as string,
                  })
                )
              }
            />
          ))}
        </View>
      ) : null}
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
  videoHeader: {
    backgroundColor: "aliceblue",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  videoHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: Helvetica,
  },
  videoArea: {
    marginVertical: 20,
    borderTopWidth: 0.2,
  },
});
