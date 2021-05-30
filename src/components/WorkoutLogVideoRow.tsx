import * as React from "react";
import { Alert, Platform, StyleSheet, Text } from "react-native";
import {
  downloadFormVideo,
  exerciseLogData,
  setLogData,
  workoutLogData,
  workoutLogUrl,
} from "../slices/workoutLogsSlice";
import { Helvetica, successColor } from "../util/constants";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Button } from "./Button";
import { baseURL } from "../config/axios.config";
import { useNavigation, useRoute } from "@react-navigation/core";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { AnimatedIonicon } from "./AnimatedIonicon";
import { useAppDispatch } from "..";
import { HomeNavigation } from "../navigators/HomeTabNavigator";
import { Swipeable } from "./Swipeable";
import { Collapsible } from "./Collapsible";

interface WorkoutLogVideo {
  set: setLogData & {
    exerciseId: exerciseLogData["_id"];
    exerciseName: exerciseLogData["name"];
    workoutLogId: workoutLogData["_id"];
  };
  deleteVideo: () => void;
  showDownload?: boolean;
}

const maxButtonFontSize = 10;
const maxIconSize = 25;
const rowInitialHeight = 70;

export function WorkoutLogVideoRow({
  set,
  deleteVideo,
  showDownload,
}: WorkoutLogVideo) {
  const navigation = useNavigation<HomeNavigation>();
  const route = useRoute();
  const dispatch = useAppDispatch();

  const rightMostSnapPoint = showDownload ? -160 : -80;
  const snapPoints: number[] = [rightMostSnapPoint, 0];
  const [collapsed, setCollapsed] = React.useState(false);

  const videoUrl =
    set.formVideoName ||
    `${baseURL}${workoutLogUrl}/${set.workoutLogId}/exercises/${set.exerciseId}/sets/${set._id}/video`;
  const videoTitle = `${set.exerciseName} ${set.repetitions} x ${set.weight} ${set.unit}`;

  function handleDownloadVideo() {
    dispatch(
      downloadFormVideo({
        fileExtension: set.formVideoExtension,
        videoUrl,
        videoTitle,
      })
    );
    showDownloadAlert();
  }

  function showDownloadAlert() {
    const message = Platform.select({
      ios: "the video will appear in the photos app once completed.",
      android:
        "the video will appear under Videos > Pictures in the files app once completed.",
    });
    const hideButtons = () => {};
    Alert.alert(
      "Download started",
      `Downloading ${videoTitle}: ${message}`,
      [{ text: "Ok", onPress: hideButtons }],
      { cancelable: true, onDismiss: hideButtons }
    );
  }

  return (
    <Collapsible
      initialHeight={rowInitialHeight}
      collapsed={collapsed}
      onCollapsed={deleteVideo}
    >
      <Swipeable
        snapPoints={snapPoints}
        mainAreaStyle={styles.videoRow}
        rightArea={(translateX, snapPoints) => (
          <WorkoutLogVideoButtons
            handleDelete={() => setCollapsed(true)}
            snapPoints={snapPoints}
            handleDownload={showDownload ? handleDownloadVideo : undefined}
            translateX={translateX}
          />
        )}
      >
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
          onPress={() => {
            const logIsNew = route.name === "logForm";
            navigation.navigate(logIsNew ? "NewLog" : "Logs", {
              screen: "showVideo",
              params: { videoTitle, videoUrl, hideTabBar: !logIsNew },
            });
          }}
          color={successColor}
          style={styles.playButton}
        >
          <Ionicon name="play-circle-outline" size={35} color="aliceblue" />
        </Button>
      </Swipeable>
    </Collapsible>
  );
}

interface WorkoutLogVideoButtonsProps {
  snapPoints: number[];
  translateX: Animated.SharedValue<number>;
  handleDownload?: () => void;
  handleDelete: () => void;
}

function WorkoutLogVideoButtons({
  translateX,
  handleDownload,
  handleDelete,
  snapPoints,
}: WorkoutLogVideoButtonsProps) {
  const rightMostSnapPoint = snapPoints[0];
  const buttonFontSize = useDerivedValue(() =>
    interpolate(
      translateX.value,
      [rightMostSnapPoint, 0],
      [maxButtonFontSize, 0]
    )
  );
  const iconFontSize = useDerivedValue(() =>
    interpolate(translateX.value, [rightMostSnapPoint, 0], [maxIconSize, 0])
  );
  const animatedDownloadButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: buttonFontSize.value,
  }));
  const animatedDownloadIconStyle = useAnimatedStyle(() => ({
    fontSize: iconFontSize.value,
  }));
  const animatedTrashIconStyle = useAnimatedStyle(() => ({
    fontSize: iconFontSize.value,
  }));
  const animatedDeleteButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: buttonFontSize.value,
  }));

  return (
    <>
      {handleDownload ? (
        <Button onPress={handleDownload} style={styles.button}>
          <AnimatedIonicon
            name="download-outline"
            color="white"
            style={animatedDownloadIconStyle}
          />
          <Animated.Text
            style={[styles.buttonText, animatedDownloadButtonTextStyle]}
          >
            Download
          </Animated.Text>
        </Button>
      ) : null}
      <Button onPress={handleDelete} style={styles.button} color="red">
        <AnimatedIonicon
          name="trash"
          color="white"
          style={animatedTrashIconStyle}
        />
        <Animated.Text
          style={[styles.buttonText, animatedDeleteButtonTextStyle]}
        >
          Delete
        </Animated.Text>
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  videoRow: {
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  videoRowText: {
    fontFamily: Helvetica,
    fontSize: 18,
    paddingRight: 20,
    fontWeight: "300",
  },
  videoRowHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  playButton: {
    flexDirection: "row",
    height: undefined,
    flex: 1,
    maxWidth: 45,
  },
  button: {
    height: undefined,
    borderRadius: 0,
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontFamily: Helvetica,
  },
});
