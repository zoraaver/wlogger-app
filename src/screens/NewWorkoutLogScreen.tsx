import { RouteProp, useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { WorkoutLogForm } from "../components/WorkoutLogForm";
import { WorkoutLogVideoRow } from "../components/WorkoutLogVideoRow";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { HomeNavigation } from "../navigators/HomeTabNavigator";
import { NewWorkoutLogStackParamList } from "../navigators/NewWorkoutLogStackNavigator";
import { setLogInProgress } from "../slices/UISlice";
import {
  findExerciseIndex,
  findSetIndex,
  postWorkoutLog,
  removeFormVideo,
  videoSetsSelector,
} from "../slices/workoutLogsSlice";
import { BalsamiqSans, Helvetica, successColor } from "../util/constants";

export type NewWorkoutLogScreenRouteProp = RouteProp<
  NewWorkoutLogStackParamList,
  "logForm"
>;

export function NewWorkoutLogScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigation>();

  const workoutLog = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const setsWithVideos = useAppSelector(videoSetsSelector);

  const videoUploadProgress = useAppSelector(
    (state) => state.workoutLogs.videoUploadProgress
  );
  const videoUploadInProgress = !!Object.keys(videoUploadProgress).length;

  React.useEffect(() => {
    if (videoUploadInProgress)
      navigation.navigate("NewLog", { screen: "upload" });
  }, [videoUploadProgress]);

  function handleCancelWorkout() {
    Alert.alert(
      "Abort workout log",
      "Are you sure you want to abort this workout log? All changes will be lost.",
      [
        {
          text: "Ok",
          onPress: () => dispatch(setLogInProgress(false)),
        },
        { text: "Cancel" },
      ]
    );
  }

  async function handleLogWorkout() {
    const workoutLogPosted = dispatch(postWorkoutLog(workoutLog));
    if (!setsWithVideos.length) {
      await workoutLogPosted;
      dispatch(setLogInProgress(false));
    }
  }

  return (
    <SafeAreaView style={styles.newWorkoutLogScreen}>
      <ScrollView>
        <WorkoutLogForm />
        <Text style={styles.tableTitle}>Logged sets:</Text>
        <WorkoutLogTable workoutLog={workoutLog} />
        <View style={styles.videoArea}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoHeaderText}>Form videos</Text>
          </View>
          {setsWithVideos.map((set, index) => (
            <WorkoutLogVideoRow
              set={set}
              key={index}
              deleteVideo={() => {
                const exerciseIndex = findExerciseIndex(
                  workoutLog,
                  set.exerciseId
                );
                dispatch(
                  removeFormVideo({
                    exerciseIndex,
                    setIndex: findSetIndex(
                      workoutLog.exercises[exerciseIndex],
                      set._id
                    ),
                  })
                );
              }}
              showDownload={false}
            />
          ))}
        </View>
        <View style={styles.finishWorkoutArea}>
          <Button
            onPress={handleLogWorkout}
            color={successColor}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Log workout</Text>
          </Button>
          <Button
            onPress={handleCancelWorkout}
            color="red"
            style={styles.button}
          >
            <Text style={styles.buttonText}>Abort workout</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  newWorkoutLogScreen: {
    flex: 1,
    backgroundColor: "powderblue",
  },
  tableTitle: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: BalsamiqSans,
    paddingVertical: 20,
  },
  buttonText: {
    fontFamily: Helvetica,
    color: "white",
    fontSize: 18,
  },
  button: {
    marginVertical: 10,
  },
  finishWorkoutArea: {
    padding: 10,
    justifyContent: "space-between",
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
