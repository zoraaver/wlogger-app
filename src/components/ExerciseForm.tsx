import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
  LayoutAnimation,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import NumericInput, { INumericInputProps } from "react-native-numeric-input";
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
  dayOfWeek: Day;
  weekPosition: number;
}

export function ExerciseForm({
  selectedExerciseIndex,
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

  const [formData, setFormData] = React.useState<exerciseData>(
    selectedExercise ? { ...selectedExercise } : initialExerciseData
  );
  const { width } = useWindowDimensions();
  const orientation: DeviceOrientation = useOrientation();
  const numericInputWidth = width * 0.7;
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

  function handleSubmit() {
    if (!formData.name) {
      setExerciseNameError("Exercise name is required");
    } else {
      if (formData._id) {
        setExerciseNameError("");
        dispatch(
          updateExercise({
            updatedExercise: formData,
            day: dayOfWeek,
            exerciseIndex: selectedExerciseIndex,
            weekPosition,
          })
        );
      } else {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        dispatch(
          addExercise({
            position: weekPosition,
            day: dayOfWeek,
            exerciseData: formData,
          })
        );
      }
    }
  }

  function handleDelete() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(
      deleteExercise({
        weekPosition,
        day: dayOfWeek,
        exerciseIndex: selectedExerciseIndex,
      })
    );
  }

  const isNewExercise = !(formData._id || formData.addedInCurrentSession);

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
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Sets: </Text>
        <NumericInput
          totalWidth={numericInputWidth}
          {...commonNumericInputProps}
          onChange={(sets) => setFormData({ ...formData, sets })}
          value={formData.sets}
          valueType="integer"
          minValue={1}
          initValue={formData.sets}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Reps: </Text>
        <NumericInput
          totalWidth={numericInputWidth}
          {...commonNumericInputProps}
          onChange={(repetitions) => setFormData({ ...formData, repetitions })}
          value={formData.repetitions}
          valueType="integer"
          minValue={0}
          initValue={formData.repetitions}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Weight: </Text>
        <NumericInput
          totalWidth={numericInputWidth}
          {...commonNumericInputProps}
          onChange={(weight) => setFormData({ ...formData, weight })}
          value={formData.weight}
          valueType="real"
          step={1.25}
          minValue={0}
          initValue={formData.weight}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Unit: </Text>
        <WeightUnitButtons
          unit={formData.unit}
          onUnitChange={(unit) => setFormData({ ...formData, unit })}
        />
      </View>
      <Button
        onPress={handleSubmit}
        style={styles.iconButton}
        color={successColor}
      >
        <Ionicon
          name={isNewExercise ? "add" : "save"}
          color="white"
          size={23}
        />
        <Text style={styles.buttonText}>
          {isNewExercise ? "Add exercise" : "Save changes"}
        </Text>
      </Button>
      {isNewExercise ? null : (
        <Button onPress={handleDelete} style={styles.iconButton} color="red">
          <Ionicon name="trash" color="white" size={23} />
          <Text style={styles.buttonText}>Delete exercise</Text>
        </Button>
      )}
    </View>
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

const commonNumericInputProps: INumericInputProps = {
  type: "plus-minus",
  rounded: true,
  leftButtonBackgroundColor: "red",
  rightButtonBackgroundColor: successColor,
  minValue: 0,
  totalHeight: 50,
  iconStyle: { color: "white" } as ViewStyle,
  inputStyle: { backgroundColor: "white" },
  containerStyle: { flex: 1 },
  onChange: () => {},
};
