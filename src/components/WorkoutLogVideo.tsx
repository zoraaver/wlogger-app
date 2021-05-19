import * as React from "react";
import { Text } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Video from "react-native-video";
import { baseURL } from "../config/axios.config";
import {
  exerciseLogData,
  setLogData,
  workoutLogData,
  workoutLogUrl,
} from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Button } from "./Button";

interface WorkoutLogVideo {
  set: setLogData & {
    exerciseId: exerciseLogData["_id"];
    exerciseName: exerciseLogData["name"];
    workoutLogId: workoutLogData["_id"];
  };
  authToken: string;
}

export function WorkoutLogVideo({ set, authToken }: WorkoutLogVideo) {
  const videoUrl = `${baseURL}${workoutLogUrl}/${set.workoutLogId}/exercises/${set.exerciseId}/sets/${set._id}/video`;
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const videoRef = React.useRef<Video>(null);
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  function handlePlay() {
    setVideoPlaying(true);
    // videoRef.current?.presentFullscreenPlayer();
  }

  return (
    <View style={styles.videoRow}>
      {videoPlaying ? (
        <Video
          style={[
            {
              minHeight: 150,
              width: windowWidth - 20,
            },
            styles.video,
          ]}
          source={{ headers: { Authorisation: authToken }, uri: videoUrl }}
          ref={videoRef}
          fullscreen={true}
          fullscreenAutorotate={true}
          onEnd={() => setVideoPlaying(false)}
          onError={() => setVideoPlaying(false)}
          audioOnly={false}
          controls={true}
          resizeMode="contain"
        ></Video>
      ) : (
        <>
          <Text style={styles.videoRowText}>
            <Text style={styles.videoRowHeaderText}>{set.exerciseName}</Text>
          </Text>
          <Button onPress={handlePlay} style={styles.playButton}>
            <Ionicon name="play-circle-outline" size={25} color="aliceblue" />
            <Text style={styles.playButtonText}>Play</Text>
          </Button>
        </>
      )}
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
    paddingHorizontal: 10,
    flex: 1,
  },
  videoRowText: {
    fontFamily: Helvetica,
    fontSize: 18,
    paddingRight: 20,
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
  video: {
    // position: "relative",
    // top: 0,
    // left: 0,
    // right: 0,
    flex: 1,
  },
});
