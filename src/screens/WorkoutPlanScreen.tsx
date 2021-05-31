import { useFocusEffect, useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { HorizontalDivider } from "../components/HorizontalDivider";
import { WeekItem } from "../components/WeekItem";
import { WorkoutPlanStackParamList } from "../navigators/WorkoutPlanStackNavigator";
import { getWorkoutPlan } from "../slices/workoutPlansSlice";
import { Helvetica, successColor } from "../util/constants";

type WorkoutPlanScreenRouteProp = RouteProp<WorkoutPlanStackParamList, "show">;

export function WorkoutPlanScreen() {
  const dispatch = useAppDispatch();
  const {
    params: { _id },
  } = useRoute<WorkoutPlanScreenRouteProp>();
  const workoutPlan = useAppSelector(
    (state) => state.workoutPlans.editWorkoutPlan
  );

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getWorkoutPlan(_id));
    }, [])
  );
  const [expandedWeek, setExpandedWeek] = React.useState(-1);

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={styles.workoutPlanScreen}
    >
      {workoutPlan?.weeks ? (
        <FlatList
          style={{ flex: 1, backgroundColor: "powderblue" }}
          data={workoutPlan.weeks}
          renderItem={({ item: week }) => (
            <WeekItem
              week={week}
              expanded={expandedWeek === week.position}
              setExpanded={setExpandedWeek}
            />
          )}
          keyExtractor={(week) => week.position.toString()}
          ItemSeparatorComponent={() => <HorizontalDivider />}
          extraData={expandedWeek}
          ListFooterComponent={() => <HorizontalDivider />}
        />
      ) : (
        <ActivityIndicator size="large" color="black" />
      )}
      <View style={styles.controls}>
        <Button onPress={() => {}} color={successColor} style={styles.button}>
          <Text style={styles.buttonText}>Add week</Text>
        </Button>
        <Button onPress={() => {}} style={styles.button}>
          <Text style={styles.buttonText}>Start Plan</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  workoutPlanScreen: { flex: 1, backgroundColor: "powderblue" },
  buttonText: { fontFamily: Helvetica, color: "white", fontSize: 18 },
  controls: { justifyContent: "center" },
  button: { margin: 10 },
});
