import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { View, Text } from "react-native";
import { useAppDispatch } from "..";
import { WorkoutPlanNavigation } from "../navigators/WorkoutPlanStackNavigator";
import { setNewWorkoutModalData } from "../slices/UISlice";
import { addWorkout, Day, weekData } from "../slices/workoutPlansSlice";
import { BalsamiqSans, Helvetica, infoColor } from "../util/constants";
import { Button } from "./Button";

interface NewWorkoutModalProps {
  visible: boolean;
  remainingDays?: Day[];
  weekPosition?: weekData["position"];
  weekTitle?: string;
}

export function NewWorkoutModal({
  visible,
  remainingDays,
  weekPosition,
  weekTitle,
}: NewWorkoutModalProps) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<WorkoutPlanNavigation>();

  function handleAddWorkout(day: Day) {
    if (weekPosition && weekTitle) {
      dispatch(addWorkout({ day, weekPosition }));
      dispatch(setNewWorkoutModalData());
      const workoutTitle = `${weekTitle} : ${day}`;
      navigation.navigate("showWorkout", {
        weekPosition,
        dayOfWeek: day,
        title: workoutTitle,
      });
    }
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback
        onPress={() => dispatch(setNewWorkoutModalData())}
      >
        <View style={styles.wrapper}>
          <View style={styles.newWorkoutModal}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{weekTitle} - select a day:</Text>
            </View>
            {remainingDays?.map((day) => (
              <Button
                onPress={() => {
                  handleAddWorkout(day);
                }}
                key={day}
                style={styles.dayButton}
                color="white"
              >
                <Text style={styles.dayText}>{day}</Text>
              </Button>
            ))}
            <Button
              onPress={() => dispatch(setNewWorkoutModalData())}
              style={styles.cancelButton}
              color="red"
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  newWorkoutModal: {
    maxHeight: "50%",
    backgroundColor: "lightgrey",
    borderRadius: 10,
    borderWidth: 0.2,
  },
  dayButton: {
    width: "100%",
    alignItems: "center",
    borderRadius: 0,
    borderTopWidth: 0.6,
    height: 50,
  },
  headerText: {
    textAlign: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    fontSize: 22,
    flexGrow: 1,
    marginTop: Platform.select({ ios: 12 }),
    fontFamily: BalsamiqSans,
  },
  header: {
    width: "100%",
    backgroundColor: infoColor,
    height: 50,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  buttonText: { fontFamily: Helvetica, color: "white", fontSize: 20 },
  cancelButton: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: "100%",
    borderTopWidth: 0.6,
    height: 50,
  },
  dayText: { fontFamily: Helvetica, fontSize: 18 },
});
