import * as React from "react";
import { Alert, Platform, StyleSheet, Text } from "react-native";
import {
  downloadFormVideo,
  exerciseLogData,
  setLogData,
  workoutLogData,
  workoutLogUrl,
} from "../slices/workoutLogsSlice";
import { Helvetica, primaryColor, successColor } from "../util/constants";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Button } from "./Button";
import { baseURL } from "../config/axios.config";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useAppDispatch } from "..";
import { HomeNavigation } from "../navigators/HomeTabNavigator";
import { Swipeable } from "./Swipeable";
import { Collapsible } from "./Collapsible";
import { AnimatedSwipeButton } from "./AnimatedSwipeButton";

interface WorkoutLogVideo {
  set: setLogData & {
    exerciseId: exerciseLogData["_id"];
    exerciseName: exerciseLogData["name"];
    workoutLogId: workoutLogData["_id"];
  };
  deleteVideo: () => void;
  showDownload?: boolean;
}

export function WorkoutLogVideoRow({
  set,
  deleteVideo,
  showDownload,
}: WorkoutLogVideo) {
  const navigation = useNavigation<HomeNavigation>();
  const route = useRoute();
  const dispatch = useAppDispatch();

  const leftSnapPoint = showDownload ? -160 : -80;
  const snapPoints: number[] = [leftSnapPoint, 0];
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
    Alert.alert(
      "Download started",
      `Downloading ${videoTitle}: ${message}`,
      [{ text: "Ok" }],
      { cancelable: true }
    );
  }

  function handlePlayVideo() {
    const logIsNew = route.name === "logForm";
    navigation.navigate(logIsNew ? "NewLog" : "Logs", {
      screen: "showVideo",
      params: { videoTitle, videoUrl, hideTabBar: !logIsNew },
    });
  }

  return (
    <Collapsible collapsed={collapsed} onCollapsed={deleteVideo}>
      <Swipeable
        snapPoints={snapPoints}
        mainAreaStyle={styles.videoRow}
        height={70}
        snapDuration={300}
        rightArea={(translateX) => (
          <>
            {showDownload ? (
              <AnimatedSwipeButton
                leftSnapPoint={leftSnapPoint}
                translateX={translateX}
                color={primaryColor}
                iconName="download-outline"
                onPress={handleDownloadVideo}
                text="Download"
              />
            ) : null}
            <AnimatedSwipeButton
              leftSnapPoint={leftSnapPoint}
              translateX={translateX}
              color="red"
              iconName="trash"
              onPress={() => setCollapsed(true)}
              text="Delete"
            />
          </>
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
          onPress={handlePlayVideo}
          color={successColor}
          style={styles.playButton}
        >
          <Ionicon name="play-circle-outline" size={35} color="aliceblue" />
        </Button>
      </Swipeable>
    </Collapsible>
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
});
