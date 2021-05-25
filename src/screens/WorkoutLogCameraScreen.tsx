import { useNavigation } from "@react-navigation/core";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { RNCamera as Camera } from "react-native-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const megaByte = 1000000;

export function WorkoutLogCameraScreen() {
  const camera = React.useRef<Camera>(null);
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = React.useState(false);

  async function handleRecord() {
    console.log(isRecording);
    if (isRecording) {
      camera.current?.stopRecording();
    } else {
      const res = camera.current?.recordAsync({
        maxFileSize: 50 * megaByte,
      });
    }
    setIsRecording(!isRecording);
  }

  return (
    <SafeAreaView style={styles.workoutLogCameraScreen} edges={[]}>
      <Camera
        ref={camera}
        captureAudio={true}
        style={styles.camera}
        onRecordingEnd={() => navigation.goBack()}
      />
      <CameraControls handleRecord={handleRecord} />
    </SafeAreaView>
  );
}

interface CameraControlsProps {
  handleRecord: () => void;
}

function CameraControls({ handleRecord }: CameraControlsProps) {
  return (
    <View style={styles.cameraControls}>
      <TouchableOpacity
        onPress={handleRecord}
        style={styles.recordButton}
        activeOpacity={0.4}
      ></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutLogCameraScreen: { flex: 1 },
  camera: { flex: 1 },
  cameraControls: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    height: "10%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "tomato",
  },
});
