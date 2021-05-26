import * as React from "react";
import { View, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { setLogInProgress } from "../slices/UISlice";

export function WorkoutLogVideoUploadScreen() {
  const uploadProgress = useAppSelector(
    (state) => state.workoutLogs.videoUploadProgress
  );
  const dispatch = useAppDispatch();

  const percentages = Object.values(uploadProgress);
  const allUploaded = !percentages.some((percentage) => percentage !== 100);

  if (allUploaded) {
    dispatch(setLogInProgress(false));
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Uploading videos...</Text>
      {percentages.map((percentage) => (
        <View style={{ flex: 1 }}>
          <Text>{percentage}</Text>
        </View>
      ))}
    </View>
  );
}
