import { RouteProp, useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppDispatch, useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { Collapsible } from "../components/Collapsible";
import { WorkoutLogForm } from "../components/WorkoutLogForm";
import { WorkoutLogVideoRow } from "../components/WorkoutLogVideoRow";
import { ExerciseTable } from "../containers/ExerciseTable";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { AuthenticatedNavigation } from "../navigators/AuthenticatedTabNavigator";
import { NewWorkoutLogStackParamList } from "../navigators/NewWorkoutLogStackNavigator";
import { setLogInProgress } from "../slices/UISlice";
import {
  exerciseLogData,
  postWorkoutLog,
  removeFormVideo,
  setLogData,
  videoSetsSelector,
  WorkoutLogPosition,
} from "../slices/workoutLogsSlice";
import {
  getNextWorkout,
  isWorkoutToday,
  workoutData,
} from "../slices/workoutsSlice";
import { BalsamiqSans, Helvetica, successColor } from "../util/constants";

function handleCancelWorkoutAlert(dispatch: AppDispatch) {
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

export type NewWorkoutLogScreenRouteProp = RouteProp<
  NewWorkoutLogStackParamList,
  "logForm"
>;

export function NewWorkoutLogScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AuthenticatedNavigation>();

  const workoutLog = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );
  const setsWithVideos = useAppSelector(videoSetsSelector);

  const videoUploadProgress = useAppSelector(
    (state) => state.workoutLogs.videoUploadProgress
  );
  const videoUploadInProgress = !!Object.keys(videoUploadProgress).length;

  const workout = useAppSelector((state) => state.workouts.nextWorkout);
  const workoutIsToday = isWorkoutToday(workout);

  const [
    workoutPosition,
    setWorkoutPosition,
  ] = React.useState<WorkoutLogPosition>({ exerciseIndex: 0, setIndex: 0 });

  const [workoutFinished, setWorkoutFinished] = React.useState(false);

  React.useEffect(() => {
    if (videoUploadInProgress)
      navigation.navigate("NewLog", { screen: "upload" });
  }, [videoUploadProgress]);

  React.useEffect(() => {
    dispatch(getNextWorkout());
  }, []);

  function advanceWorkoutPosition() {
    if (workout) {
      const currentExercise = workout.exercises[workoutPosition.exerciseIndex];

      const lastExerciseReached =
        workoutPosition.exerciseIndex === workout.exercises.length - 1;

      const lastSetReached =
        workoutPosition.setIndex === currentExercise.sets - 1;

      if (lastExerciseReached && lastSetReached) {
        setWorkoutFinished(true);
      } else if (!lastSetReached) {
        setWorkoutPosition({
          ...workoutPosition,
          setIndex: workoutPosition.setIndex + 1,
        });
      } else {
        setWorkoutPosition({
          setIndex: 0,
          exerciseIndex: workoutPosition.exerciseIndex + 1,
        });
      }
    }
  }

  async function handleLogWorkout() {
    const workoutLogPosted = dispatch(postWorkoutLog(workoutLog));
    if (!setsWithVideos.length) {
      await workoutLogPosted;
      dispatch(setLogInProgress(false));
    }
  }

  function handleRowPress(exerciseIndex: number, setIndex: number) {
    navigation.navigate("NewLog", {
      screen: "editLogEntry",
      params: {
        exerciseIndex,
        setIndex,
        title: `exercise ${exerciseIndex + 1}: set ${setIndex + 1}`,
      },
    });
  }

  const workoutTableHeaderText: string = workoutFinished
    ? "Workout complete"
    : ` Workout progress: exercise ${workoutPosition.exerciseIndex + 1}/${
        workout?.exercises.length
      }, set ${workoutPosition.setIndex + 1}/ ${
        workout?.exercises[workoutPosition.exerciseIndex].sets
      } `;

  return (
    <ScrollView style={styles.newWorkoutLogScreen}>
      {workout && workoutIsToday ? (
        <>
          <WorkoutTableCollapsible
            workout={workout}
            workoutTableHeaderText={workoutTableHeaderText}
          />
          <Collapsible collapsed={workoutFinished}>
            <WorkoutLogForm
              workout={workout}
              workoutPosition={workoutPosition}
              advanceWorkoutPosition={advanceWorkoutPosition}
              workoutFinished={workoutFinished}
            />
          </Collapsible>
        </>
      ) : (
        <WorkoutLogForm />
      )}
      <Text style={styles.tableTitle}>Logged sets:</Text>
      <WorkoutLogTable workoutLog={workoutLog} onRowPress={handleRowPress} />
      <WorkoutLogVideos videoSets={setsWithVideos} />
      <View style={styles.finishWorkoutArea}>
        <Button
          onPress={handleLogWorkout}
          color={successColor}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Log workout</Text>
        </Button>
        <Button
          onPress={() => handleCancelWorkoutAlert(dispatch)}
          color="red"
          style={styles.button}
        >
          <Text style={styles.buttonText}>Abort workout</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

interface WorkoutTableCollapsibleProps {
  workoutTableHeaderText: string;
  workout: workoutData;
}

function WorkoutTableCollapsible({
  workoutTableHeaderText,
  workout,
}: WorkoutTableCollapsibleProps) {
  const { top: paddingTop } = useSafeAreaInsets();
  const [workoutTableCollapsed, setWorkoutTableCollapsed] = React.useState(
    true
  );
  return (
    <View style={[styles.workoutTable, { paddingTop }]}>
      <Button
        onPress={() => setWorkoutTableCollapsed(!workoutTableCollapsed)}
        color="lightgreen"
        style={styles.workoutTableButton}
      >
        <Text style={styles.workoutTableButtonText}>
          {workoutTableHeaderText}
        </Text>
      </Button>
      <Collapsible collapsed={workoutTableCollapsed}>
        <ExerciseTable workout={workout} />
      </Collapsible>
    </View>
  );
}

type VideoSet = setLogData &
  WorkoutLogPosition & {
    workoutLogId: string | undefined;
    exerciseId: exerciseLogData["_id"];
    setId: setLogData["_id"];
    exerciseName: exerciseLogData["name"];
  };

interface WorkoutLogVideosProps {
  videoSets: Array<VideoSet>;
}

function WorkoutLogVideos({ videoSets }: WorkoutLogVideosProps) {
  const dispatch = useAppDispatch();
  if (!videoSets.length) return null;

  function handleDelete(set: VideoSet) {
    dispatch(
      removeFormVideo({
        exerciseIndex: set.exerciseIndex,
        setIndex: set.setIndex,
      })
    );
  }

  return (
    <View style={styles.videoArea}>
      <View style={styles.videoHeader}>
        <Text style={styles.videoHeaderText}>Form videos</Text>
      </View>
      {videoSets.map((set) => (
        <WorkoutLogVideoRow
          set={set}
          key={set.exerciseIndex.toString() + set.setIndex.toString()}
          deleteVideo={() => handleDelete(set)}
          showDownload={false}
        />
      ))}
    </View>
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
  workoutTableButton: {
    borderRadius: 0,
    height: 60,
  },
  workoutTableButtonText: {
    fontFamily: Helvetica,
    fontSize: 20,
    fontWeight: "300",
  },
  workoutTable: {
    backgroundColor: "lightgreen",
  },
});
