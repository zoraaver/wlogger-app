import * as React from "react";
import { StyleSheet } from "react-native";
import { RNCamera as Camera } from "react-native-camera";
import { SafeAreaView } from "react-native-safe-area-context";

export function WorkoutLogCameraScreen() {
  const camera = React.useRef<Camera>(null);

  return (
    <SafeAreaView style={styles.workoutLogCameraScreen} edges={[]}>
      <Camera ref={camera} captureAudio={true} style={styles.camera} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  workoutLogCameraScreen: { flex: 1 },
  camera: { flex: 1 },
});
