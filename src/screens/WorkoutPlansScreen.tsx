import { useFocusEffect } from "@react-navigation/core";
import * as React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { HorizontalDivider } from "../components/HorizontalDivider";
import { WorkoutPlanItem } from "../components/WorkoutPlanItem";
import {
  getWorkoutPlans,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";

export function WorkoutPlansScreen() {
  const dispatch = useAppDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getWorkoutPlans());
    }, [])
  );

  const workoutPlans: workoutPlanHeaderData[] = useAppSelector(
    (state) => state.workoutPlans.data
  );

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        data={workoutPlans}
        keyExtractor={(workoutPlan) => workoutPlan._id}
        renderItem={(data) => <WorkoutPlanItem workoutPlan={data.item} />}
        ItemSeparatorComponent={() => (
          <HorizontalDivider backgroundColor="lightgrey" />
        )}
      />
    </SafeAreaView>
  );
}
