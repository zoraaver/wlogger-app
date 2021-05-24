import * as React from "react";
import {
  View,
  Text,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TextInput,
  StyleSheet,
} from "react-native";
import { Button } from "./Button";
import { WorkoutLogTimer } from "./WorkoutLogTimer";
import Ionicon from "react-native-vector-icons/Ionicons";
import { addSet, EntryData } from "../slices/workoutLogsSlice";
import { Helvetica, successColor } from "../util/constants";
import { useAppDispatch } from "..";
import { useFocusEffect } from "@react-navigation/core";

const initialFormData = (): EntryData => ({
  name: "",
  repetitions: 0,
  weight: 0,
  unit: "kg",
  restInterval: Date.now(),
});

export function WorkoutLogForm() {
  const [setInProgress, setSetInProgress] = React.useState(false);
  const [exerciseNameError, setExerciseNameError] = React.useState("");
  const dispatch = useAppDispatch();

  const [formData, setFormData] = React.useState<EntryData>(initialFormData());

  useFocusEffect(
    React.useCallback(() => {
      setFormData(initialFormData());
    }, [])
  );

  function handleWeightChange(newWeight: string): void {
    const weight = Number(newWeight);
    if (!isNaN(weight) && weight >= 0) {
      setFormData({ ...formData, weight });
    }
  }

  function handleRepetitionsChange(newRepetitions: string): void {
    const repetitions = Number(newRepetitions);
    if (
      !isNaN(repetitions) &&
      repetitions >= 0 &&
      Number.isInteger(repetitions)
    ) {
      setFormData({ ...formData, repetitions });
    }
  }

  function handleAddSet() {
    if (setInProgress) {
      if (formData.name === "") {
        setExerciseNameError("Exercise name is required");
        return;
      }
      setExerciseNameError("");
      dispatch(addSet(formData));
      setFormData({ ...formData, restInterval: Date.now() });
      setSetInProgress(!setInProgress);
    } else {
      setFormData({
        ...formData,
        restInterval: (Date.now() - formData.restInterval) / 1000,
      });
      setSetInProgress(!setInProgress);
    }
  }

  return (
    <>
      <WorkoutLogTimer
        formData={formData}
        setFormData={setFormData}
        setInProgress={setInProgress}
        handleAddSet={handleAddSet}
      />
      <View style={styles.inputArea}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Exercise: </Text>
          <View style={{ flex: 1 }}>
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
          </View>
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Weight: </Text>
          <TextInput
            style={[styles.logInput, styles.logNumberInput]}
            value={formData.weight ? formData.weight.toString() : ""}
            onChangeText={handleWeightChange}
            keyboardType="numeric"
            returnKeyType="done"
          />
          <AddRemoveButtonPair
            onAddPress={() => {
              handleWeightChange((formData.weight + 1).toString());
            }}
            onRemovePress={() => {
              handleWeightChange((formData.weight - 1).toString());
            }}
          />
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Reps: </Text>
          <TextInput
            style={[styles.logInput, styles.logNumberInput]}
            value={formData.repetitions ? formData.repetitions.toString() : ""}
            onChangeText={handleRepetitionsChange}
            keyboardType="numeric"
            returnKeyType="done"
          />
          <AddRemoveButtonPair
            onAddPress={() => {
              handleRepetitionsChange((formData.repetitions + 1).toString());
            }}
            onRemovePress={() => {
              handleRepetitionsChange((formData.repetitions - 1).toString());
            }}
          />
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Unit: </Text>
          <Button
            onPress={() => setFormData({ ...formData, unit: "kg" })}
            style={[
              styles.unitButton,
              styles.leftUnitButton,
              {
                borderWidth: formData.unit === "kg" ? 2 : 0,
              },
            ]}
          >
            <Text style={styles.buttonText}>kg</Text>
          </Button>
          <Button
            onPress={() => setFormData({ ...formData, unit: "lb" })}
            style={[
              styles.unitButton,
              styles.rightUnitButton,
              {
                borderWidth: formData.unit === "lb" ? 2 : 0,
              },
            ]}
          >
            <Text style={styles.buttonText}>lb</Text>
          </Button>
        </View>
      </View>
    </>
  );
}

interface AddRemoveButtonProps {
  onPress: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
  action: "add" | "remove";
}

function AddRemoveButton({ onPress, action }: AddRemoveButtonProps) {
  return (
    <Button
      style={styles.addRemoveButtons}
      onPress={onPress}
      color={action === "add" ? successColor : "red"}
    >
      <Ionicon name={action} size={25} color="white" />
    </Button>
  );
}

interface AddRemoveButtonPairProps {
  onAddPress: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
  onRemovePress: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

function AddRemoveButtonPair({
  onAddPress,
  onRemovePress,
}: AddRemoveButtonPairProps) {
  return (
    <>
      <AddRemoveButton action="add" onPress={onAddPress} />
      <AddRemoveButton action="remove" onPress={onRemovePress} />
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
    flex: 1,
    width: "100%",
    padding: 20,
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  inputLabel: {
    width: 100,
    fontSize: 20,
    fontFamily: Helvetica,
    paddingRight: 10,
  },
  logNumberInput: {
    width: 90,
    flexGrow: undefined,
  },
  addRemoveButtons: { height: 50, width: 50 },
  unitButton: {
    flex: 1,
    height: 50,
    borderColor: "lavender",
  },
  rightUnitButton: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  leftUnitButton: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
});
