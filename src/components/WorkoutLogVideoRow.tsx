import * as React from "react";
import { StyleSheet, Text } from "react-native";
import {
  deleteSetVideo,
  exerciseLogData,
  setLogData,
  workoutLogData,
  workoutLogUrl,
} from "../slices/workoutLogsSlice";
import { Helvetica, successColor } from "../util/constants";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Button } from "./Button";
import { baseURL } from "../config/axios.config";
import { useNavigation } from "@react-navigation/core";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { AnimatedIonicon } from "./AnimatedIonicon";
import { useAppDispatch } from "..";
import {
  useHorizontalSwipeHandler,
  useVerticalCollapseTransition,
} from "../util/hooks";

interface WorkoutLogVideo {
  set: setLogData & {
    exerciseId: exerciseLogData["_id"];
    exerciseName: exerciseLogData["name"];
    workoutLogId: workoutLogData["_id"];
  };
}

const rightMostSnapPoint = 160;
const snapPoints: number[] = [-rightMostSnapPoint, 0];
const maxButtonFontSize = 10;
const maxIconSize = 25;
const rowInitialHeight = 70;

export function WorkoutLogVideoRow({ set }: WorkoutLogVideo) {
  const navigation = useNavigation<
    StackNavigationProp<WorkoutLogStackParamList>
  >();
  const dispatch = useAppDispatch();

  const {
    absoluteTranslateX,
    translateX,
    panGestureEventHandler,
  } = useHorizontalSwipeHandler(snapPoints);

  const {
    animatedCollapseItemStyle,
    collapseTransition,
  } = useVerticalCollapseTransition(rowInitialHeight, 300, handleDeleteVideo);

  const buttonFontSize = useDerivedValue(() =>
    Math.min(
      absoluteTranslateX.value / (rightMostSnapPoint / maxButtonFontSize),
      maxButtonFontSize
    )
  );
  const hiddenAreaOpacity = useDerivedValue(
    () => 0.5 + 0.5 * (absoluteTranslateX.value / rightMostSnapPoint)
  );
  const iconFontSize = useDerivedValue(() =>
    Math.min(
      maxIconSize,
      absoluteTranslateX.value / (rightMostSnapPoint / maxIconSize)
    )
  );

  const animatedVideoRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const animatedHiddenAreaStyle = useAnimatedStyle(() => ({
    width: absoluteTranslateX.value,
    opacity: hiddenAreaOpacity.value,
  }));
  const animatedDeleteButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: buttonFontSize.value,
  }));
  const animatedDownloadButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: buttonFontSize.value,
  }));
  const animatedTrashIconStyle = useAnimatedStyle(() => ({
    fontSize: iconFontSize.value,
  }));
  const animatedDownloadIconStyle = useAnimatedStyle(() => ({
    fontSize: iconFontSize.value,
  }));

  function handleDeleteVideo() {
    dispatch(
      deleteSetVideo({
        exerciseId: set.exerciseId as string,
        setId: set._id as string,
        workoutLogId: set.workoutLogId as string,
      })
    );
  }

  const videoUrl = `${baseURL}${workoutLogUrl}/${set.workoutLogId}/exercises/${set.exerciseId}/sets/${set._id}/video`;
  const videoTitle = `${set.exerciseName} ${set.repetitions} x ${set.weight} ${set.unit}`;

  return (
    <Animated.View style={[styles.wrapper, animatedCollapseItemStyle]}>
      <PanGestureHandler onGestureEvent={panGestureEventHandler} minDist={20}>
        <Animated.View style={[styles.videoRow, animatedVideoRowStyle]}>
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
            color={successColor}
            style={styles.playButton}
          >
            <Ionicon name="play-circle-outline" size={35} color="aliceblue" />
          </Button>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[styles.hiddenArea, animatedHiddenAreaStyle]}>
        <Button onPress={() => {}} style={styles.button}>
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
        <Button onPress={collapseTransition} style={styles.button} color="red">
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
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  videoRow: {
    backgroundColor: "white",
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 20,
    flex: 1,
    ...StyleSheet.absoluteFillObject,
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
  hiddenArea: {
    flexDirection: "row",
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
