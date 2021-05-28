import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Button } from "./Button";
import { WorkoutLogTimer } from "./WorkoutLogTimer";
import Ionicon from "react-native-vector-icons/Ionicons";
import { addFormVideo, addSet, EntryData } from "../slices/workoutLogsSlice";
import { Helvetica, successColor } from "../util/constants";
import { useAppDispatch } from "..";
import { useNavigation, useRoute } from "@react-navigation/core";
import { HomeNavigation } from "../navigators/HomeTabNavigator";
import { NewWorkoutLogScreenRouteProp } from "../screens/NewWorkoutLogScreen";
import { getFileStats } from "../util/util";
import NumericInput from "react-native-numeric-input";
import { DeviceOrientation, useOrientation } from "../util/hooks";

export function WorkoutLogForm() {
  const [setInProgress, setSetInProgress] = React.useState(false);
  const [exerciseNameError, setExerciseNameError] = React.useState("");
  const videoRecording = useRoute<NewWorkoutLogScreenRouteProp>().params;
  const dispatch = useAppDispatch();

  const [formData, setFormData] = React.useState<EntryData>({
    name: "",
    repetitions: 0,
    weight: 0,
    unit: "kg",
    restInterval: Date.now(),
  });
  const navigation = useNavigation<HomeNavigation>();
  const width = useWindowDimensions().width;
  const orientation: DeviceOrientation = useOrientation();
  const numericInputWidth =
    width * (orientation === DeviceOrientation.portrait ? 0.65 : 0.8);

  function handleVideo() {
    if (videoRecording.cancelled) {
      navigation.navigate("NewLog", { screen: "camera" });
    } else {
      navigation.setParams({ cancelled: true });
    }
  }

  async function handleAddSet() {
    if (setInProgress) {
      if (formData.name === "") {
        setExerciseNameError("Exercise name is required");
        return;
      }
      setExerciseNameError("");
      dispatch(addSet(formData));

      if (!videoRecording.cancelled) {
        const { size, type } = await getFileStats(videoRecording.uri.slice(6));
        const { uri } = videoRecording;
        dispatch(
          addFormVideo({
            file: { uri, name: uri, size, type },
          })
        );
        navigation.setParams({ cancelled: true });
      }

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
          <NumericInput
            inputStyle={styles.numericInput}
            containerStyle={styles.numericInputContainer}
            totalWidth={numericInputWidth}
            totalHeight={50}
            onChange={(weight) => setFormData({ ...formData, weight })}
            value={formData.weight}
            type="plus-minus"
            valueType="real"
            rounded
            minValue={0}
            step={1.25}
            leftButtonBackgroundColor="red"
            rightButtonBackgroundColor={successColor}
          />
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Reps: </Text>
          <NumericInput
            value={formData.repetitions}
            onChange={(repetitions) =>
              setFormData({ ...formData, repetitions })
            }
            containerStyle={styles.numericInputContainer}
            inputStyle={styles.numericInput}
            rounded
            step={1}
            totalHeight={50}
            totalWidth={numericInputWidth}
            type="plus-minus"
            valueType="integer"
            leftButtonBackgroundColor="red"
            rightButtonBackgroundColor={successColor}
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
  numericInputContainer: {
    flex: 1,
  },
  numericInput: {
    backgroundColor: "white",
  },
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
