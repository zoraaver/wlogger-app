import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { DismissKeyboard } from "../components/DismissKeyboard";
import { EntryData } from "../slices/workoutLogsSlice";
import { Helvetica, successColor } from "../util/constants";
import { useHideTabBarInNestedStack, useInterval } from "../util/hooks";
import { renderRestInterval } from "../util/util";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

export function NewWorkoutLogScreen() {
  useHideTabBarInNestedStack();
  const [timeElapsedSinceLastSet, setTimeElapsedSinceLastSet] = React.useState(
    0
  );
  const [setInProgress, setSetInProgress] = React.useState(false);

  const [formData, setFormData] = React.useState<EntryData>({
    name: "",
    repetitions: 0,
    weight: 0,
    unit: "kg",
    restInterval: Date.now(),
  });

  useInterval(
    () => {
      setTimeElapsedSinceLastSet(Date.now() - formData.restInterval);
    },
    setInProgress ? undefined : 1000
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

  return (
    <DismissKeyboard>
      <SafeAreaView
        style={styles.newWorkoutLogScreen}
        edges={["bottom", "left", "right"]}
      >
        <View style={styles.timer}>
          <Text style={styles.timerText}>
            {renderRestInterval(timeElapsedSinceLastSet / 1000)}
          </Text>
          <View style={styles.timerButtons}>
            <Button
              onPress={() => {
                setFormData({ ...formData, restInterval: Date.now() });
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Reset timer</Text>
            </Button>
            <BeginSetButton
              setInProgress={setInProgress}
              setSetInProgress={setSetInProgress}
            />
          </View>
        </View>
        <View style={styles.inputArea}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Exercise: </Text>
            <TextInput
              style={styles.logInput}
              placeholder="Exercise name"
              placeholderTextColor="grey"
              value={formData.name}
              clearButtonMode="while-editing"
              returnKeyType="next"
              onChangeText={(name) => setFormData({ ...formData, name })}
            />
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
              value={
                formData.repetitions ? formData.repetitions.toString() : ""
              }
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
            <Picker
              selectedValue={formData.unit}
              onValueChange={(unit) => setFormData({ ...formData, unit })}
              style={{ flexGrow: 1, backgroundColor: "white", height: 50 }}
              itemStyle={styles.buttonText}
              dropdownIconColor="black"
              mode="dropdown"
            >
              <Picker.Item label="kg" value="kg" />
              <Picker.Item label="lb" value="lb" />
            </Picker>
          </View>
        </View>
      </SafeAreaView>
    </DismissKeyboard>
  );
}

interface BeginSetButtonProps {
  setInProgress: boolean;
  setSetInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

function BeginSetButton({
  setInProgress,
  setSetInProgress,
}: BeginSetButtonProps) {
  return (
    <Button
      onPress={() => setSetInProgress(!setInProgress)}
      color={setInProgress ? "red" : successColor}
      style={styles.button}
    >
      <Text style={styles.buttonText}>
        {setInProgress ? "End set" : "Begin set"}
      </Text>
    </Button>
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
  newWorkoutLogScreen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "powderblue",
  },
  timer: {
    height: "25%",
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  timerText: {
    fontSize: 30,
    fontFamily: Helvetica,
    borderRadius: 5,
    padding: 5,
    color: "black",
  },
  buttonText: { color: "white", fontFamily: Helvetica, fontSize: 20 },
  timerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    height: 50,
  },
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
  logNumberInput: { width: 50, flexGrow: undefined },
  addRemoveButtons: { height: 50, width: 50 },
});
