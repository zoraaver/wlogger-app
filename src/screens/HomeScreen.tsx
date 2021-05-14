import { useFocusEffect } from "@react-navigation/core";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { ExerciseTable } from "../containers/ExerciseTable";
import { getCurrentPlan } from "../slices/workoutPlansSlice";
import { getNextWorkout } from "../slices/workoutsSlice";
import {
  BalsamiqSans,
  Helvetica,
  infoColor,
  successColor,
} from "../util/constants";
import { isToday, isTomorrow } from "../util/util";

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const nextWorkout = useAppSelector((state) => state.workouts.nextWorkout);
  const message = useAppSelector((state) => state.workouts.message);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getNextWorkout());
      dispatch(getCurrentPlan());
    }, [])
  );

  function renderHeaderText() {
    switch (message) {
      case undefined:
        break;
      case "Completed":
        return "You've finished your current workout plan!";
      default:
        return message;
    }
    if (!nextWorkout || !nextWorkout.date) return;
    const workoutDate: Date = new Date(nextWorkout.date as string);
    if (isToday(workoutDate)) {
      return "Today's workout:";
    } else if (isTomorrow(workoutDate)) {
      return "Tomorrow's workout:";
    } else {
      return `Next workout: ${workoutDate.toDateString()}`;
    }
  }

  function renderBeginWorkoutButton() {
    if (!nextWorkout || !nextWorkout.date) return;
    const workoutDate: Date = new Date(nextWorkout.date as string);
    const buttonText: string = isToday(workoutDate)
      ? "Begin workout"
      : "Log a separate workout";
    return (
      <Button color={successColor} onPress={() => {}}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Button>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.homeScreenTopSafeArea} edges={["top"]} />
      <SafeAreaView
        style={styles.homeScreen}
        edges={["bottom", "left", "right"]}
      >
        <View style={styles.nextWorkout}>
          <View style={styles.nextWorkoutHeader}>
            <Text style={styles.nextWorkoutHeaderText}>
              {renderHeaderText()}
            </Text>
          </View>
          {nextWorkout ? (
            <ExerciseTable workout={nextWorkout} />
          ) : (
            message && (
              <View style={styles.nextWorkoutBody}>
                <Button onPress={() => {}} color={successColor}>
                  <Text style={styles.buttonText}>Start a new plan</Text>
                </Button>
                <Button onPress={() => {}} color={successColor}>
                  <Text style={styles.buttonText}>Log a workout</Text>
                </Button>
              </View>
            )
          )}
          <View style={styles.beginWorkout}>{renderBeginWorkoutButton()}</View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  homeScreenTopSafeArea: { flex: 0, backgroundColor: infoColor },
  homeScreen: { flex: 1, backgroundColor: "powderblue" },
  nextWorkout: {
    maxHeight: "66%",
  },
  nextWorkoutHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: infoColor,
    maxHeight: 100,
  },
  nextWorkoutHeaderText: {
    fontSize: 25,
    fontFamily: BalsamiqSans,
    textAlign: "center",
  },
  nextWorkoutBody: {
    margin: 20,
    justifyContent: "space-around",
    minHeight: 100,
  },
  buttonText: { fontSize: 18, fontFamily: Helvetica, color: "white" },
  beginWorkout: {
    margin: 20,
  },
});
