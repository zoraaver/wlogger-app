import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import { View, StyleSheet } from "react-native";
import { WorkoutLogForm } from "../components/WorkoutLogForm";
import { NewWorkoutLogStackParamList } from "../navigators/NewWorkoutLogStackNavigator";

type EditLogEntryScreenRouteProp = RouteProp<
  NewWorkoutLogStackParamList,
  "editLogEntry"
>;

export function EditLogEntryScreen() {
  const workoutLogEntryPosition = useRoute<EditLogEntryScreenRouteProp>()
    .params;

  return (
    <View style={styles.editLogEntryScreen}>
      <WorkoutLogForm editEntry={workoutLogEntryPosition} />
    </View>
  );
}

const styles = StyleSheet.create({
  editLogEntryScreen: { flex: 1, backgroundColor: "lightyellow" },
});
