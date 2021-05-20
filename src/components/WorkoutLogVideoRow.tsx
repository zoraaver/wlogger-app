import * as React from "react";
import { Text } from "react-native";
import { StyleSheet, View } from "react-native";
import {
  exerciseLogData,
  setLogData,
  workoutLogData,
  workoutLogUrl,
} from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Button } from "./Button";
import { baseURL } from "../config/axios.config";
import { useNavigation } from "@react-navigation/core";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

interface WorkoutLogVideo {
  set: setLogData & {
    exerciseId: exerciseLogData["_id"];
    exerciseName: exerciseLogData["name"];
    workoutLogId: workoutLogData["_id"];
  };
}

export function WorkoutLogVideoRow({ set }: WorkoutLogVideo) {
  const videoUrl = `${baseURL}${workoutLogUrl}/${set.workoutLogId}/exercises/${set.exerciseId}/sets/${set._id}/video`;
  const videoTitle = `${set.exerciseName} ${set.repetitions} x ${set.weight} ${set.unit}`;
  const navigation = useNavigation<
    StackNavigationProp<WorkoutLogStackParamList>
  >();

  return (
    <View style={styles.videoRow}>
      <Text style={styles.videoRowText}>
        <Text style={styles.videoRowHeaderText}>
          {set.exerciseName}
          {"\n"}
        </Text>
        <Text>
          {set.repetitions} x {set.weight} {set.unit}
        </Text>
      </Text>
      <Button
        onPress={() =>
          navigation.navigate("showVideo", { videoUrl, videoTitle })
        }
        style={styles.playButton}
      >
        <Ionicon name="play-circle-outline" size={25} color="aliceblue" />
        <Text style={styles.playButtonText}>Play</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  videoRow: {
    backgroundColor: "white",
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 20,
    flex: 1,
  },
  videoRowText: {
    fontFamily: Helvetica,
    fontSize: 18,
    paddingRight: 20,
    fontWeight: "300",
  },
  videoRowHeaderText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  playButton: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  playButtonText: {
    fontFamily: Helvetica,
    color: "aliceblue",
    paddingLeft: 5,
  },
});
