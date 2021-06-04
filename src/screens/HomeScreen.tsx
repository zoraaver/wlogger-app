import { useFocusEffect, useNavigation } from "@react-navigation/core";
import * as React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { HorizontalDivider } from "../components/HorizontalDivider";
import { WorkoutPlanItem } from "../components/WorkoutPlanItem";
import { ExerciseTable } from "../containers/ExerciseTable";
import { AuthenticatedNavigation } from "../navigators/AuthenticatedTabNavigator";
import { setLogInProgress } from "../slices/UISlice";
import {
  clearEditWorkoutLog,
  clearFormVideos,
} from "../slices/workoutLogsSlice";
import { getCurrentPlan } from "../slices/workoutPlansSlice";
import { getNextWorkout, workoutData } from "../slices/workoutsSlice";
import { Helvetica, successColor } from "../util/constants";
import { isToday, isTomorrow } from "../util/util";

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const nextWorkout = useAppSelector((state) => state.workouts.nextWorkout);
  const currentPlan = useAppSelector((state) => state.workoutPlans.currentPlan);
  const message = useAppSelector((state) => state.workouts.message);
  const navigation = useNavigation<AuthenticatedNavigation>();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getNextWorkout());
      dispatch(getCurrentPlan());
    }, [])
  );

  function handleBeginWorkout() {
    dispatch(setLogInProgress(true));
    dispatch(clearEditWorkoutLog());
    dispatch(clearFormVideos());
  }

  function handleStartPlan() {
    navigation.jumpTo("Plans", { screen: "index" });
  }

  return (
    <ScrollView style={styles.homeScreen}>
      <Text style={styles.nextWorkoutHeaderText}>
        {renderHeaderText(nextWorkout, message)}
      </Text>
      {nextWorkout ? (
        <>
          <ExerciseTable workout={nextWorkout} />
          <BeginWorkoutButton
            workout={nextWorkout}
            handleBeginWorkout={handleBeginWorkout}
          />
        </>
      ) : (
        <>
          <Button
            onPress={handleStartPlan}
            color={successColor}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Start a new plan</Text>
          </Button>
          <Button
            onPress={handleBeginWorkout}
            color={successColor}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Log a workout</Text>
          </Button>
        </>
      )}
      {currentPlan ? (
        <>
          <Text style={styles.nextWorkoutHeaderText}>Current plan: </Text>
          <HorizontalDivider />
          <WorkoutPlanItem workoutPlan={currentPlan} swipeable={false} />
        </>
      ) : null}
    </ScrollView>
  );
}

interface BeginWorkoutButtonProps {
  workout: workoutData;
  handleBeginWorkout: () => void;
}

function BeginWorkoutButton({
  workout,
  handleBeginWorkout,
}: BeginWorkoutButtonProps) {
  if (!workout.date) return null;
  const workoutDate: Date = new Date(workout.date as string);
  const buttonText: string = isToday(workoutDate)
    ? "Begin workout"
    : "Log a separate workout";
  return (
    <Button
      color={successColor}
      onPress={handleBeginWorkout}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </Button>
  );
}

function renderHeaderText(workout?: workoutData, message?: string) {
  switch (message) {
    case undefined:
      break;
    case "Completed":
      return "You've finished your current workout plan!";
    default:
      return message;
  }
  if (!workout || !workout.date) return;
  const workoutDate: Date = new Date(workout.date as string);
  if (isToday(workoutDate)) {
    return "Today's workout:";
  } else if (isTomorrow(workoutDate)) {
    return "Tomorrow's workout:";
  } else {
    return `Next workout: ${workoutDate.toDateString()}`;
  }
}

const styles = StyleSheet.create({
  homeScreenTopSafeArea: { flex: 1, backgroundColor: "powderblue" },
  homeScreen: { backgroundColor: "powderblue", flex: 1 },
  nextWorkoutHeaderText: {
    fontSize: 25,
    textAlign: "center",
    padding: 10,
    flex: 1,
    backgroundColor: "lightyellow",
  },
  buttonText: { fontSize: 18, fontFamily: Helvetica, color: "white" },
  button: { marginHorizontal: 20, marginVertical: 10 },
});
