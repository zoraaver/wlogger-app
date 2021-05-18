import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { Text, StyleSheet, LayoutAnimation, View } from "react-native";
import { useAppDispatch } from "..";
import { WorkoutLogStackParamList } from "../navigators/WorkoutLogStackNavigator";
import {
  deleteWorkoutLog,
  workoutLogHeaderData,
} from "../slices/workoutLogsSlice";
import { Helvetica } from "../util/constants";
import { Button } from "./Button";
import Ionicon from "react-native-vector-icons/Ionicons";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

interface WorkoutLogItemProps {
  workoutLog: workoutLogHeaderData;
}

function findNearestSnapPoint(
  position: number,
  velocity: number,
  snapPoints: number[]
) {
  "worklet";
  const currentPosition: number = position + velocity * 0.2;
  const positionDeltas: number[] = snapPoints.map((snapPoint) =>
    Math.abs(snapPoint - currentPosition)
  );
  const minPositionDelta: number = Math.min(...positionDeltas);
  return snapPoints.find(
    (snapPoint) => Math.abs(snapPoint - currentPosition) === minPositionDelta
  ) as number;
}

const AnimatedIonicon = Animated.createAnimatedComponent(Ionicon);
const height = 50;
const maxDeleteButtonFontSize = 10;
const maxIconSize = 25;

export function WorkoutLogItem({
  workoutLog: { createdAt, exerciseCount, setCount, _id },
}: WorkoutLogItemProps) {
  const logDate: Date = new Date(createdAt);
  const navigation = useNavigation<
    StackNavigationProp<WorkoutLogStackParamList>
  >();
  const dispatch = useAppDispatch();
  const translateX = useSharedValue(0);
  const absoluteTranslateX = useDerivedValue(() => Math.abs(translateX.value));
  const deleteButtonOpacity = useDerivedValue(
    () => absoluteTranslateX.value / 100.0
  );
  const deleteButtonFontSize = useDerivedValue(() =>
    Math.min(maxDeleteButtonFontSize, absoluteTranslateX.value / 10.0)
  );
  const snapPoints: number[] = [-100, 0];

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: { startingTranslateX: number }) => {
      ctx.startingTranslateX = translateX.value;
    },
    onActive: ({ translationX }, { startingTranslateX }) => {
      if (translationX + startingTranslateX <= 0) {
        translateX.value = translationX + startingTranslateX;
      }
    },
    onEnd: ({ velocityX, translationX }) => {
      const snapPoint = findNearestSnapPoint(
        translationX,
        velocityX,
        snapPoints
      );
      translateX.value = withTiming(snapPoint);
    },
  });

  const animatedIconStyle = useAnimatedStyle(() => ({
    fontSize: Math.min(maxIconSize, absoluteTranslateX.value / 4.0),
  }));
  const animatedLogHeaderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const animatedHiddenAreaStyle = useAnimatedStyle(() => ({
    width: absoluteTranslateX.value,
    height,
    opacity: deleteButtonOpacity.value,
  }));
  const animatedDeleteButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: deleteButtonFontSize.value,
  }));

  return (
    <View style={styles.workoutLogItem}>
      <PanGestureHandler onGestureEvent={eventHandler}>
        <Animated.View
          // onPress={() => navigation.navigate("show", { id: _id })}
          style={[styles.workoutLogHeader, animatedLogHeaderStyle]}
        >
          <Text style={styles.workoutLogHeaderText}>
            {logDate.toDateString()}:{" "}
            <Text style={{ fontWeight: "300" }}>
              {exerciseCount} exercise{exerciseCount === 1 ? ", " : "s, "}
              {setCount} set{setCount === 1 ? "" : "s"}
            </Text>
          </Text>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={animatedHiddenAreaStyle}>
        <Button
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            dispatch(deleteWorkoutLog(_id));
          }}
          style={styles.deleteButton}
          color="red"
        >
          <AnimatedIonicon
            name="trash"
            color="white"
            style={animatedIconStyle}
          />
          <Animated.Text
            style={[styles.deleteButtonText, animatedDeleteButtonTextStyle]}
          >
            Delete
          </Animated.Text>
        </Button>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutLogHeader: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height,
  },
  workoutLogItem: {
    flexDirection: "row",
    justifyContent: "flex-end",
    height,
  },
  workoutLogHeaderText: {
    fontSize: 20,
    fontFamily: Helvetica,
  },
  deleteButton: {
    height,
    borderRadius: 0,
    padding: 10,
  },
  deleteButtonText: {
    color: "white",
    fontFamily: Helvetica,
  },
});
