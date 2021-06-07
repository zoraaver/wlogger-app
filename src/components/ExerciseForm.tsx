import * as React from "react";
import { View, Text, StyleSheet, LayoutAnimation } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "..";
import {
  addExercise,
  Day,
  deleteExercise,
  updateExercise,
} from "../slices/workoutPlansSlice";
import { exerciseData } from "../slices/workoutsSlice";
import { Helvetica, successColor } from "../util/constants";
import { DeviceOrientation, useOrientation } from "../util/hooks";
import { WeightUnitButtons } from "./WeightUnitButtons";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Button } from "./Button";
import { WeightInput } from "./WeightInput";
import { RepsInput } from "./RepsInput";
import { SetsInput } from "./SetsInput";

const initialExerciseData: exerciseData = {
  name: "",
  sets: 1,
  weight: 10,
  repetitions: 10,
  unit: "kg",
  restInterval: 0,
};

interface ExerciseFormProps {
  selectedExerciseIndex: number;
  resetExerciseSelection: () => void;
  dayOfWeek: Day;
  weekPosition: number;
}

export function ExerciseForm({
  selectedExerciseIndex,
  resetExerciseSelection,
  dayOfWeek,
  weekPosition,
}: ExerciseFormProps) {
  const selectedExercise = useAppSelector(
    (state) =>
      state.workoutPlans.editWorkoutPlan?.weeks
        .find((week) => week.position === weekPosition)
        ?.workouts.find((workout) => workout.dayOfWeek === dayOfWeek)
        ?.exercises[selectedExerciseIndex]
  );

  const [formData, setFormData] = React.useState(initialExerciseData);
  const orientation = useOrientation();
  const [numericInputWidth, setNumericInputWidth] = React.useState(200);
  const [exerciseNameError, setExerciseNameError] = React.useState("");
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    setExerciseNameError("");
    if (selectedExercise) {
      setFormData({ ...selectedExercise });
    } else {
      setFormData(initialExerciseData);
    }
  }, [selectedExercise]);

  const isNewExercise = !(formData._id || formData.addedInCurrentSession);

  function handleSubmit() {
    if (!formData.name) {
      setExerciseNameError("Exercise name is required");
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (!isNewExercise) {
        handleUpdateExercise();
      } else {
        handleAddExercise();
      }
    }
  }

  function handleUpdateExercise() {
    setExerciseNameError("");
    dispatch(
      updateExercise({
        updatedExercise: formData,
        day: dayOfWeek,
        exerciseIndex: selectedExerciseIndex,
        weekPosition,
      })
    );
  }

  function handleAddExercise() {
    dispatch(
      addExercise({
        weekPosition,
        day: dayOfWeek,
        exerciseData: formData,
      })
    );
    setFormData(initialExerciseData);
  }

  function handleDeleteExercise() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(
      deleteExercise({
        weekPosition,
        day: dayOfWeek,
        exerciseIndex: selectedExerciseIndex,
      })
    );
    resetExerciseSelection();
  }

  return (
    <View style={styles.exerciseForm}>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>
          {orientation === DeviceOrientation.landscape
            ? "Exercise name: "
            : "Exercise: "}
        </Text>
        <TextInput
          style={[
            styles.exerciseInput,
            {
              borderColor: exerciseNameError ? "red" : "black",
            },
          ]}
          onChangeText={(name) => {
            setFormData({ ...formData, name });
            setExerciseNameError("");
          }}
          value={formData.name}
          placeholder={
            exerciseNameError ? "Exercise name is required" : "Exercise name"
          }
          placeholderTextColor={exerciseNameError ? "red" : "grey"}
          clearButtonMode="while-editing"
          onLayout={({ nativeEvent }) =>
            setNumericInputWidth(nativeEvent.layout.width)
          }
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Sets: </Text>
        <SetsInput
          sets={formData.sets}
          onSetsChange={(sets) => setFormData({ ...formData, sets })}
          width={numericInputWidth}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Reps: </Text>
        <RepsInput
          repetitions={formData.repetitions}
          onChange={(repetitions) => setFormData({ ...formData, repetitions })}
          width={numericInputWidth}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Weight: </Text>
        <WeightInput
          weight={formData.weight}
          onWeightChange={(weight) => setFormData({ ...formData, weight })}
          width={numericInputWidth}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Unit: </Text>
        <WeightUnitButtons
          unit={formData.unit}
          onUnitChange={(unit) => setFormData({ ...formData, unit })}
        />
      </View>
      <AddOrSaveButton
        handleSubmit={handleSubmit}
        isNewExercise={isNewExercise}
      />
      {isNewExercise ? null : (
        <Button
          onPress={handleDeleteExercise}
          style={styles.iconButton}
          color="red"
        >
          <Ionicon name="trash" color="white" size={23} />
          <Text style={styles.buttonText}>Delete exercise</Text>
        </Button>
      )}
    </View>
  );
}

interface AddOrSaveButtonProps {
  handleSubmit: () => void;
  isNewExercise: boolean;
}

function AddOrSaveButton({
  handleSubmit,
  isNewExercise,
}: AddOrSaveButtonProps) {
  return (
    <Button
      onPress={handleSubmit}
      style={styles.iconButton}
      color={successColor}
    >
      <Ionicon name={isNewExercise ? "add" : "save"} color="white" size={23} />
      <Text style={styles.buttonText}>
        {isNewExercise ? "Add exercise" : "Save changes"}
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  exerciseForm: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "aliceblue",
    flex: 1,
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    marginTop: 5,
  },
  exerciseInput: {
    height: 45,
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "white",
    fontFamily: Helvetica,
    fontSize: 20,
    flexGrow: 1,
    paddingLeft: 15,
  },
  inputLabel: {
    fontSize: 20,
    fontFamily: Helvetica,
    paddingRight: 10,
    width: "30%",
  },
  buttonText: {
    fontFamily: Helvetica,
    color: "white",
    fontSize: 18,
    paddingLeft: 10,
  },
  iconButton: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
});
