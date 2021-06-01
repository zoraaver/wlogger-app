import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { WorkoutPlanNavigation } from "../navigators/WorkoutPlanStackNavigator";
import { weekData, totalSets } from "../slices/workoutPlansSlice";
import { workoutData } from "../slices/workoutsSlice";
import { Helvetica } from "../util/constants";

interface WorkoutItemProps {
  workout: workoutData;
  weekTitle: string;
  weekPosition: weekData["position"];
}

export function WorkoutItem({
  workout,
  weekTitle,
  weekPosition,
}: WorkoutItemProps) {
  const totalNumberOfSets = totalSets(workout);
  const navigation = useNavigation<WorkoutPlanNavigation>();
  const workoutTitle = `${weekTitle} : ${workout.dayOfWeek}`;
  return (
    <TouchableOpacity
      key={workout.dayOfWeek}
      style={styles.workoutItem}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("showWorkout", {
          dayOfWeek: workout.dayOfWeek,
          weekPosition,
          title: workoutTitle,
        })
      }
    >
      <Text style={styles.itemText}>
        <Text style={{ fontWeight: "bold" }}>{workout.dayOfWeek}: </Text>
        {workout.exercises.length} exercise
        {workout.exercises.length === 1 ? null : "s"}, {totalNumberOfSets} set
        {totalNumberOfSets === 1 ? null : "s"}
      </Text>
    </TouchableOpacity>
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
    height: 50,
    flex: 1,
    borderTopColor: "lightgrey",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
});
