import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { Text, StyleSheet } from "react-native";
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
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { findNearestSnapPoint } from "../util/worklets";

interface WorkoutLogItemProps {
  workoutLog: workoutLogHeaderData;
}

type itemOpacity = 0 | 0.7 | 1;

const AnimatedIonicon = Animated.createAnimatedComponent(Ionicon);

const workoutLogItemInitialHeight = 80;
const maxDeleteButtonFontSize = 10;
const maxIconSize = 25;
const rightSnapPoint = -100;
const snapPoints: number[] = [rightSnapPoint, 0];

export function WorkoutLogItem({
  workoutLog: { createdAt, exerciseCount, setCount, _id },
}: WorkoutLogItemProps) {
  const navigation = useNavigation<
    StackNavigationProp<WorkoutLogStackParamList>
  >();
  const dispatch = useAppDispatch();

  const translateX = useSharedValue(0);
  const itemOpacity = useSharedValue<itemOpacity>(1);
  const absoluteTranslateX = useDerivedValue(() => Math.abs(translateX.value));
  const deleteButtonOpacity = useDerivedValue(
    () => absoluteTranslateX.value / 100.0
  );
  const deleteButtonFontSize = useDerivedValue(() =>
    Math.min(maxDeleteButtonFontSize, absoluteTranslateX.value / 10.0)
  );
  const workoutLogItemHeight = useSharedValue(workoutLogItemInitialHeight);

  const panGestureEventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startingTranslateX: number }
  >({
    onStart: (event, ctx) => {
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

  const tapGestureEventHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>(
    {
      onFail: () => {
        itemOpacity.value = 1;
      },
      onCancel: () => {
        itemOpacity.value = 1;
      },
      onEnd: () => {
        if (translateX.value === rightSnapPoint) {
          translateX.value = withTiming(0);
        } else {
          itemOpacity.value = 0.7;
          runOnJS(navigation.navigate)({ name: "show", params: { id: _id } });
        }
      },
      onFinish: () => {
        itemOpacity.value = withDelay(100, withTiming(1)) as 1;
      },
    }
  );

  const animatedWorkoutLogItemStyle = useAnimatedStyle(() => ({
    height: workoutLogItemHeight.value,
  }));
  const animatedIconStyle = useAnimatedStyle(() => ({
    fontSize: Math.min(maxIconSize, absoluteTranslateX.value / 4.0),
  }));
  const animatedLogHeaderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: itemOpacity.value,
  }));
  const animatedHiddenAreaStyle = useAnimatedStyle(() => ({
    width: absoluteTranslateX.value,
    opacity: deleteButtonOpacity.value,
  }));
  const animatedDeleteButtonTextStyle = useAnimatedStyle(() => ({
    fontSize: deleteButtonFontSize.value,
  }));

  const handleDeleteWorkoutLog = React.useCallback(() => {
    const delay: number = 300;
    workoutLogItemHeight.value = withTiming(0, { duration: delay });
    itemOpacity.value = withTiming(0, { duration: delay }) as 0;
    setTimeout(() => {
      dispatch(deleteWorkoutLog(_id));
    }, delay + 50);
  }, [_id]);

  const logDate: Date = new Date(createdAt);

  return (
    <Animated.View style={[styles.workoutLogItem, animatedWorkoutLogItemStyle]}>
      <PanGestureHandler onGestureEvent={panGestureEventHandler}>
        <Animated.View style={styles.workoutLogItemTapArea}>
          <TapGestureHandler onGestureEvent={tapGestureEventHandler}>
            <Animated.View
              style={[styles.workoutLogHeader, animatedLogHeaderStyle]}
            >
              <Text style={styles.workoutLogItemText}>
                {logDate.toDateString()}
              </Text>
              <Text style={styles.workoutLogDetailsText}>
                {exerciseCount} exercise{exerciseCount === 1 ? ", " : "s, "}
                {setCount} set{setCount === 1 ? "" : "s"}
              </Text>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={animatedHiddenAreaStyle}>
        <Button
          onPress={handleDeleteWorkoutLog}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  workoutLogHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  workoutLogItem: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  workoutLogItemTapArea: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "lightgrey",
  },
  workoutLogItemText: {
    fontSize: 20,
    fontFamily: Helvetica,
    fontWeight: "bold",
  },
  workoutLogDetailsText: {
    fontWeight: "300",
    fontFamily: Helvetica,
  },
  deleteButton: {
    borderRadius: 0,
    height: undefined,
    flex: 1,
  },
  deleteButtonText: {
    color: "white",
    fontFamily: Helvetica,
  },
});
