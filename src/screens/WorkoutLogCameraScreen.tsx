import { useNavigation } from "@react-navigation/core";
import * as React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
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
  const navigation = useNavigation<NewLogNavigation>();
  const camera = React.useRef<Camera>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const recordingCancelled = React.useRef(false);

  async function handleRecord() {
    if (isRecording) {
      camera.current?.stopRecording();
    } else {
      const recording:
        | RecordResponse
        | undefined = await camera.current?.recordAsync({
        maxFileSize: 50 * megaByte,
      });
      if (recording) {
        setIsRecording(false);
        navigation.navigate("logForm", {
          ...recording,
          cancelled: recordingCancelled.current,
        });
      }
    }
  }

  function handleCancel() {
    if (isRecording) {
      recordingCancelled.current = true;
      camera.current?.stopRecording();
    } else {
      navigation.navigate("logForm", {
        cancelled: true,
      } as any);
    }
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
  const [recordButtonWidth, setRecordButtonWidth] = React.useState(50);
  const recordButtonStyle: ViewStyle = {
    width: recordButtonWidth,
    borderRadius: recordButtonWidth / 2,
  };

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
          onLayout={(event) =>
            setRecordButtonWidth(event.nativeEvent.layout.height)
          }
          onPress={handleRecord}
          style={[styles.recordButton, recordButtonStyle]}
          activeOpacity={0.4}
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
    height: "92%",
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
    height: undefined,
    borderRadius: 17,
  },
});
