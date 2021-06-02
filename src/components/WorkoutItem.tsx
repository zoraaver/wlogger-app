import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet, LayoutAnimation } from "react-native";
import { useAppDispatch } from "..";
import { WorkoutPlanNavigation } from "../navigators/WorkoutPlanStackNavigator";
import {
  weekData,
  totalSets,
  deleteWorkout,
} from "../slices/workoutPlansSlice";
import { workoutData } from "../slices/workoutsSlice";
import { Helvetica } from "../util/constants";
import { AnimatedSwipeButton } from "./AnimatedSwipeButton";
import { Swipeable } from "./Swipeable";

interface WorkoutItemProps {
  workout: workoutData;
  weekTitle: string;
  weekPosition: weekData["position"];
}

const leftSnapPoint = -70;
const snapPoints = [leftSnapPoint, 0];

export function WorkoutItem({
  workout,
  weekTitle,
  weekPosition,
}: WorkoutItemProps) {
  const navigation = useNavigation<WorkoutPlanNavigation>();
  const dispatch = useAppDispatch();

  const workoutTitle = `${weekTitle} : ${workout.dayOfWeek}`;
  const totalNumberOfSets = totalSets(workout);

  function handleDeleteWorkout() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(deleteWorkout({ weekPosition, day: workout.dayOfWeek }));
  }

  return (
    <Swipeable
      key={workout.dayOfWeek}
      mainAreaStyle={styles.workoutItem}
      snapPoints={snapPoints}
      height={50}
      onPress={() =>
        navigation.navigate("showWorkout", {
          dayOfWeek: workout.dayOfWeek,
          weekPosition,
          title: workoutTitle,
        })
      }
      rightArea={(translateX) => (
        <AnimatedSwipeButton
          leftSnapPoint={leftSnapPoint}
          translateX={translateX}
          color="red"
          iconName="trash"
          text="Delete"
          onPress={handleDeleteWorkout}
        />
      )}
    >
      <Text style={styles.itemText}>
        <Text style={{ fontWeight: "bold" }}>{workout.dayOfWeek}: </Text>
        {workout.exercises.length} exercise
        {workout.exercises.length === 1 ? null : "s"}, {totalNumberOfSets} set
        {totalNumberOfSets === 1 ? null : "s"}
      </Text>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  itemText: {
    fontFamily: Helvetica,
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
  },
  workoutItem: {
    backgroundColor: "aliceblue",
    borderTopWidth: 0.2,
    flex: 1,
    borderTopColor: "lightgrey",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
});
