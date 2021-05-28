import * as React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { Bar } from "react-native-progress";
import { setLogInProgress } from "../slices/UISlice";
import { Helvetica, successColor } from "../util/constants";

export function WorkoutLogVideoUploadScreen() {
  const uploadProgress = useAppSelector(
    (state) => state.workoutLogs.videoUploadProgress
  );
  const dispatch = useAppDispatch();

  const percentages = Object.values(uploadProgress);
  const numberOfFiles = percentages.length;
  const allUploaded = !percentages.some((percentage) => percentage !== 100);
  const progressBarWidth = 0.9 * useWindowDimensions().width;

  React.useEffect(() => {
    if (allUploaded) dispatch(setLogInProgress(false));
  }, [allUploaded]);

  return (
    <SafeAreaView
      style={styles.uploadScreen}
      edges={["bottom", "left", "right"]}
    >
      {percentages.map((percentage, index) => (
        <View key={index} style={styles.uploadProgress}>
          {percentage !== 100 ? (
            <>
              <Text style={styles.percentageText}>
                Uploading video {index + 1} of {numberOfFiles}
              </Text>
              <Text style={styles.percentageText}>{percentage} %</Text>
              <Bar
                progress={percentage / 100.0}
                animated
                color={successColor}
                height={15}
                unfilledColor="white"
                width={progressBarWidth}
                borderRadius={10}
              />
            </>
          ) : (
            <Text style={styles.percentageText}>
              Uploaded video {index + 1} of {numberOfFiles} successfully
            </Text>
          )}
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  uploadScreen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "ivory",
  },
  uploadProgress: {
    width: "100%",
    backgroundColor: "powderblue",
    height: 100,
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
  },
  percentageText: {
    fontFamily: Helvetica,
    fontSize: 20,
    textAlign: "center",
  },
});
