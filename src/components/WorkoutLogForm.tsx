import * as React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "./Button";
import { WorkoutLogTimer } from "./WorkoutLogTimer";
import Ionicon from "react-native-vector-icons/Ionicons";
import {
  addFormVideo,
  addSet,
  EntryData,
  setLogData,
  updateSet,
  WorkoutLogPosition,
} from "../slices/workoutLogsSlice";
import { Helvetica, successColor } from "../util/constants";
import { useAppDispatch, useAppSelector } from "..";
import { useNavigation, useRoute } from "@react-navigation/core";
import { AuthenticatedNavigation } from "../navigators/AuthenticatedTabNavigator";
import { NewWorkoutLogScreenRouteProp } from "../screens/NewWorkoutLogScreen";
import { getFileStats } from "../util/util";
import { WeightUnitButtons } from "./WeightUnitButtons";
import { WeightInput } from "./WeightInput";
import { RepsInput } from "./RepsInput";
import { workoutData } from "../slices/workoutsSlice";

function initialLogData(): EntryData {
  return {
    name: "",
    repetitions: 0,
    weight: 0,
    unit: "kg",
    restInterval: Date.now(),
  };
}

interface WorkoutLogFormProps {
  workout?: workoutData;
  workoutPosition?: WorkoutLogPosition;
  advanceWorkoutPosition?: () => void;
  workoutFinished?: boolean;
  editEntry?: WorkoutLogPosition;
}

export function WorkoutLogForm({
  workout,
  workoutPosition,
  advanceWorkoutPosition,
  workoutFinished,
  editEntry,
}: WorkoutLogFormProps) {
  const [setInProgress, setSetInProgress] = React.useState(false);
  const [exerciseNameError, setExerciseNameError] = React.useState("");

  const videoRecording = useRoute<NewWorkoutLogScreenRouteProp>().params;
  const dispatch = useAppDispatch();

  const entryLogData = useAppSelector((state) => {
    if (editEntry) {
      const exercicse =
        state.workoutLogs.editWorkoutLog.exercises[editEntry.exerciseIndex];
      const set: setLogData = exercicse?.sets[editEntry.setIndex];
      return { ...set, name: exercicse.name };
    }
  });

  const [formData, setFormData] = React.useState<EntryData>(
    entryLogData || initialLogData()
  );
  const navigation = useNavigation<AuthenticatedNavigation>();
  const [numericInputWidth, setNumericInputWidth] = React.useState(300);

  React.useEffect(() => {
    if (workout && !workoutFinished && workoutPosition) {
      const { exerciseIndex } = workoutPosition;
      const { repetitions, weight, name, _id, unit } = workout.exercises[
        exerciseIndex
      ];
      setFormData({
        ...formData,
        repetitions,
        weight,
        name,
        exerciseId: _id,
        unit,
        restInterval: Date.now(),
      });
    }
  }, [workoutPosition, workout, workoutFinished]);

  function handleVideo() {
    if (videoRecording.cancelled) {
      navigation.navigate("NewLog", { screen: "camera" });
    } else {
      navigation.setParams({ cancelled: true });
    }
  }

  async function handleAddSet() {
    if (setInProgress) {
      await logSet();
    } else {
      setFormData({
        ...formData,
        restInterval: (Date.now() - formData.restInterval) / 1000,
      });
    }
    setSetInProgress(!setInProgress);
  }

  async function logSet() {
    if (formData.name === "") {
      setExerciseNameError("Exercise name is required");
      return;
    }

    setExerciseNameError("");
    dispatch(addSet(formData));

    if (!videoRecording.cancelled) {
      await addLogVideo();
    }

    if (workout) {
      advanceWorkoutPosition?.();
    } else {
      setFormData({ ...formData, restInterval: Date.now() });
    }
  }

  async function addLogVideo() {
    const { size, type } = await getFileStats(videoRecording.uri.slice(6));
    const { uri } = videoRecording;
    dispatch(
      addFormVideo({
        file: { uri, name: uri, size, type },
      })
    );
    navigation.setParams({ cancelled: true });
  }

  function handleUpdateSet() {
    if (editEntry) {
      dispatch(updateSet({ ...editEntry, updatedSet: formData }));
      navigation.goBack();
    }
  }

  return (
    <>
      {editEntry ? null : (
        <WorkoutLogTimer
          formData={formData}
          setFormData={setFormData}
          setInProgress={setInProgress}
          handleAddSet={handleAddSet}
          workout={!!workout}
        />
      )}
      <View style={styles.inputArea}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Exercise: </Text>
          <View
            style={{ flex: 1 }}
            onLayout={({ nativeEvent }) =>
              setNumericInputWidth(nativeEvent.layout.width)
            }
          >
            {workout || editEntry ? (
              <Text style={styles.exerciseNameText}>{formData.name}</Text>
            ) : (
              <TextInput
                style={[
                  styles.logInput,
                  {
                    borderColor: exerciseNameError ? "red" : "black",
                  },
                ]}
                placeholder={
                  exerciseNameError ? "Exercise name required" : "Exercise name"
                }
                placeholderTextColor={exerciseNameError ? "red" : "grey"}
                value={formData.name}
                clearButtonMode="while-editing"
                returnKeyType="done"
                onChangeText={(name) => {
                  setFormData({ ...formData, name });
                  setExerciseNameError("");
                }}
              />
            )}
          </View>
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
          <Text style={styles.inputLabel}>Reps: </Text>
          <RepsInput
            onChange={(repetitions) =>
              setFormData({ ...formData, repetitions })
            }
            repetitions={formData.repetitions}
            width={numericInputWidth}
          />
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Unit: </Text>
          <WeightUnitButtons
            onUnitChange={(unit) => setFormData({ ...formData, unit })}
            unit={formData.unit}
            height={50}
          />
        </View>
        {editEntry ? (
          <Button
            onPress={handleUpdateSet}
            color={successColor}
            style={styles.editButton}
          >
            <Text style={styles.buttonText}>Save changes</Text>
          </Button>
        ) : (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Video: </Text>
            <Button
              onPress={handleVideo}
              color={videoRecording.cancelled ? "darkblue" : "darkred"}
              style={{ flex: 1 }}
            >
              <Ionicon
                name={videoRecording.cancelled ? "videocam" : "trash"}
                color="white"
                size={25}
              />
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonText: { color: "white", fontFamily: Helvetica, fontSize: 20 },
  logInput: {
    flexGrow: 1,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "white",
    paddingLeft: 15,
    fontFamily: Helvetica,
    fontSize: 20,
  },
  inputArea: {
    width: "100%",
    padding: 20,
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    marginTop: 10,
  },
  inputLabel: {
    width: 100,
    fontSize: 20,
    fontFamily: Helvetica,
    paddingRight: 10,
  },
  exerciseNameText: {
    fontSize: 30,
    fontFamily: Helvetica,
    textAlign: "center",
  },
  editButton: {
    marginVertical: 10,
  },
});
