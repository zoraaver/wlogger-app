import { useNavigation } from "@react-navigation/core";
import * as React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { RecordResponse, RNCamera as Camera } from "react-native-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { Helvetica, infoColor } from "../util/constants";
import { useInterval } from "../util/hooks";
import { renderRestInterval } from "../util/util";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { NewLogNavigation } from "../navigators/NewWorkoutLogStackNavigator";

const megaByte = 1000000;

export function WorkoutLogCameraScreen() {
  const camera = React.useRef<Camera>(null);
  const navigation = useNavigation<NewLogNavigation>();
  const [isRecording, setIsRecording] = React.useState(false);
  const videoRecording = React.useRef<Promise<RecordResponse>>();

  useInterval(async () => {
    const iosIsRecording = await camera.current?.isRecording();
    if (isRecording && !iosIsRecording) {
      console.log(await videoRecording.current);
      navigation.navigate("logForm");
    }
  }, Platform.select({ ios: 500 }));

  async function handleRecord() {
    if (
      Platform.OS === "ios" &&
      !(await camera.current?.isRecording()) &&
      isRecording
    ) {
      console.log(await videoRecording.current);
      navigation.navigate("logForm");
    } else if (isRecording) {
      camera.current?.stopRecording();
    } else {
      videoRecording.current = camera.current?.recordAsync({
        maxFileSize: 50 * megaByte,
      });
    }
  }

  function handleCancel() {
    if (isRecording) {
      camera.current?.stopRecording();
    }
    navigation.navigate("logForm");
  }

  return (
    <SafeAreaView
      style={styles.workoutLogCameraScreen}
      edges={["left", "right"]}
    >
      <Camera
        type={Camera.Constants.Type.back}
        ref={camera}
        captureAudio={true}
        style={styles.camera}
        onRecordingEnd={async () => {
          setIsRecording(false);
          console.log(await videoRecording.current);
          navigation.navigate("logForm");
        }}
        playSoundOnRecord={true}
        onRecordingStart={() => setIsRecording(true)}
      />
      <CameraControls
        handleRecord={handleRecord}
        isRecording={isRecording}
        handleCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

interface CameraControlsProps {
  handleRecord: () => void;
  handleCancel: () => void;
  isRecording: boolean;
}

function CameraControls({
  handleRecord,
  handleCancel,
  isRecording,
}: CameraControlsProps) {
  const [videoDuration, setVideoDuration] = React.useState(0);

  useInterval(
    () => {
      setVideoDuration(videoDuration + 1);
    },
    isRecording ? 1000 : undefined
  );

  return (
    <View style={styles.cameraControls}>
      <View style={styles.videoDuration}>
        <Button
          onPress={handleCancel}
          color="aliceblue"
          style={styles.cancelButton}
        >
          <MaterialIcon name="cancel" color="red" size={35} />
        </Button>
      </View>
      <View style={{ width: "33%", alignItems: "center" }}>
        <TouchableOpacity
          onPress={handleRecord}
          style={styles.recordButton}
          activeOpacity={0.5}
        >
          {isRecording ? <Text style={{ color: "white" }}>STOP</Text> : null}
        </TouchableOpacity>
      </View>
      <View style={styles.videoDuration}>
        <Text style={styles.videoDurationText}>
          {renderRestInterval(videoDuration, true)}
        </Text>
      </View>
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
    justifyContent: "space-around",
    height: "10%",
    backgroundColor: infoColor,
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  videoDurationText: {
    fontSize: 18,
    fontFamily: Helvetica,
  },
  videoDuration: {
    width: "33%",
    alignItems: "center",
  },
  cancelButton: {
    // width: "33%",
    height: undefined,
    borderRadius: 17,
  },
});
