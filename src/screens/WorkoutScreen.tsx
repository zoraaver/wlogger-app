import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import * as React from "react";
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { ExerciseTable } from "../containers/ExerciseTable";
import {
  WorkoutPlanNavigation,
  WorkoutPlanStackParamList,
} from "../navigators/WorkoutPlanStackNavigator";
import { deleteWorkout } from "../slices/workoutPlansSlice";
import { workoutData } from "../slices/workoutsSlice";
import { Helvetica, primaryColor } from "../util/constants";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Button } from "../components/Button";
import { ExerciseForm } from "../components/ExerciseForm";

export function WorkoutScreen() {
  const {
    params: { dayOfWeek, weekPosition },
  } = useRoute<RouteProp<WorkoutPlanStackParamList, "showWorkout">>();
  const [edit, setEdit] = React.useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = React.useState(-1);

  const workout: workoutData | undefined = useAppSelector((state) =>
    state.workoutPlans.editWorkoutPlan?.weeks
      .find((week) => week.position === weekPosition)
      ?.workouts.find((workout) => workout.dayOfWeek === dayOfWeek)
  );

  const dispatch = useAppDispatch();
  const navigation = useNavigation<WorkoutPlanNavigation>();
  React.useEffect(() => {
    if (!workout) {
      setTimeout(() => navigation.goBack(), 300);
    }
  }, [workout]);

  function handleDelete() {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 300,
    });
    dispatch(deleteWorkout({ position: weekPosition, day: dayOfWeek }));
  }

  function handleEdit() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEdit(!edit);
    setSelectedExerciseIndex(-1);
  }

  function rowEditButton(exerciseIndex: number) {
    return (
      <Button
        onPress={() => {
          if (exerciseIndex !== selectedExerciseIndex) {
            setSelectedExerciseIndex(exerciseIndex);
          } else {
            setSelectedExerciseIndex(-1);
          }
        }}
        style={{ height: "100%", width: "100%", borderRadius: 0 }}
      >
        {selectedExerciseIndex === exerciseIndex ? (
          <Ionicon name="ellipsis-horizontal" color="white" size={25} />
        ) : (
          <MaterialIcon name="edit" color="white" size={25} />
        )}
      </Button>
    );
  }

  return (
    <View style={styles.workoutScreen}>
      <ScrollView>
        {workout ? (
          <ExerciseTable
            workout={workout}
            editButton={edit ? rowEditButton : undefined}
          />
        ) : null}
        {edit ? (
          <ExerciseForm
            selectedExerciseIndex={selectedExerciseIndex}
            dayOfWeek={dayOfWeek}
            weekPosition={weekPosition}
          />
        ) : null}
        <View style={styles.editArea}>
          <Button onPress={handleEdit} color={primaryColor}>
            <Text style={styles.buttonText}>{edit ? "Done" : "Edit"}</Text>
          </Button>
          <Button
            style={[styles.iconButton, { marginTop: 10 }]}
            onPress={handleDelete}
            color="red"
          >
            <Ionicon name="trash" color="white" size={23} />
            <Text style={[styles.buttonText, { paddingLeft: 10 }]}>
              Delete workout
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutScreen: {
    flex: 1,
    backgroundColor: "powderblue",
    justifyContent: "space-around",
  },
  buttonText: {
    fontFamily: Helvetica,
    fontSize: 18,
    color: "white",
  },
  editArea: { paddingHorizontal: 20, marginVertical: 10, flex: 1 },
  iconButton: {
    justifyContent: "center",
    flexDirection: "row",
  },
});
