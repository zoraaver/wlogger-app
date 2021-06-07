import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EntryData } from "../slices/workoutLogsSlice";
import { Helvetica, successColor } from "../util/constants";
import { useInterval } from "../util/hooks";
import { renderRestInterval } from "../util/util";
import { Button } from "./Button";

interface WorkoutLogTimerProps {
  formData: EntryData;
  setFormData: React.Dispatch<React.SetStateAction<EntryData>>;
  setInProgress: boolean;
  handleAddSet: () => void;
  workout: boolean;
}

export function WorkoutLogTimer({
  formData,
  setFormData,
  setInProgress,
  handleAddSet,
  workout,
}: WorkoutLogTimerProps) {
  const [timeElapsedSinceLastSet, setTimeElapsedSinceLastSet] = React.useState(
    0
  );

  useInterval(
    () => {
      setTimeElapsedSinceLastSet(Date.now() - formData.restInterval);
    },
    setInProgress ? undefined : 1000
  );

  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.timer, { paddingTop: workout ? undefined : top }]}>
      <Text style={styles.timerText}>
        {renderRestInterval(timeElapsedSinceLastSet / 1000)}
      </Text>
      <View style={styles.timerButtons}>
        <Button
          onPress={() => {
            setFormData({ ...formData, restInterval: Date.now() });
          }}
          style={styles.button}
          disabled={setInProgress}
        >
          <Text style={styles.buttonText}>Reset timer</Text>
        </Button>
        <BeginSetButton
          setInProgress={setInProgress}
          handleAddSet={handleAddSet}
        />
      </View>
    </View>
  );
}

interface BeginSetButtonProps {
  setInProgress: boolean;
  handleAddSet: () => void;
}

function BeginSetButton({ setInProgress, handleAddSet }: BeginSetButtonProps) {
  return (
    <Button
      onPress={handleAddSet}
      color={setInProgress ? "red" : successColor}
      style={styles.button}
    >
      <Text style={styles.buttonText}>
        {setInProgress ? "End set" : "Begin set"}
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 10,
    height: 50,
  },
  buttonText: { color: "white", fontFamily: Helvetica, fontSize: 20 },
  timer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "aliceblue",
    borderBottomColor: "black",
    borderBottomWidth: 0.4,
  },
  timerText: {
    fontSize: 40,
    fontFamily: Helvetica,
    borderRadius: 5,
    padding: 5,
    color: "black",
  },
  timerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
