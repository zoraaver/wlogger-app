import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import * as React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { WorkoutLogForm } from "../components/WorkoutLogForm";
import { WorkoutLogTable } from "../containers/WorkoutLogTable";
import { HomeTabParamList } from "../navigators/HomeTabNavigator";
import {
  clearEditWorkoutLog,
  postWorkoutLog,
} from "../slices/workoutLogsSlice";
import { BalsamiqSans, Helvetica, successColor } from "../util/constants";
import { useHideTabBarInNestedStack } from "../util/hooks";

type NewWorkoutLogScreenNavigationProp = BottomTabNavigationProp<HomeTabParamList>;

export function NewWorkoutLogScreen() {
  useHideTabBarInNestedStack();

  const navigation = useNavigation<NewWorkoutLogScreenNavigationProp>();
  const dispatch = useAppDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(clearEditWorkoutLog());
    }, [])
  );

  const workoutLog = useAppSelector(
    (state) => state.workoutLogs.editWorkoutLog
  );

  function handleCancelWorkout() {
    Alert.alert(
      "Abort workout log",
      "Are you sure you want to abort this workout log? All changes will be lost.",
      [
        {
          text: "Ok",
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: "Home" }] }),
        },
        { text: "Cancel" },
      ]
    );
  }

  async function handleLogWorkout() {
    await dispatch(postWorkoutLog(workoutLog));
    navigation.navigate("Logs", { screen: "index" });
  }

  return (
    <SafeAreaView
      style={styles.newWorkoutLogScreen}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView>
        <WorkoutLogForm />
        <Text style={styles.tableTitle}>Logged sets:</Text>
        <WorkoutLogTable workoutLog={workoutLog} />
        <View style={styles.finishWorkoutArea}>
          <Button
            onPress={handleLogWorkout}
            color={successColor}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Log workout</Text>
          </Button>
          <Button
            onPress={handleCancelWorkout}
            color="red"
            style={styles.button}
          >
            <Text style={styles.buttonText}>Abort workout</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  newWorkoutLogScreen: {
    flex: 1,
    backgroundColor: "powderblue",
  },
  tableTitle: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: BalsamiqSans,
    paddingVertical: 20,
  },
  buttonText: {
    fontFamily: Helvetica,
    color: "white",
    fontSize: 18,
  },
  button: {
    marginVertical: 10,
  },
  finishWorkoutArea: {
    padding: 10,
    justifyContent: "space-between",
  },
});
