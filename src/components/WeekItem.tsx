import * as React from "react";
import { View, Text, StyleSheet, LayoutAnimation } from "react-native";
import { useAppDispatch } from "..";
import {
  changeWeekRepeat,
  deleteWeek,
  findRemainingWeekDays,
  weekData,
} from "../slices/workoutPlansSlice";
import { Helvetica, infoColor, primaryColor } from "../util/constants";
import { AnimatedSwipeButton } from "./AnimatedSwipeButton";
import { Button } from "./Button";
import { Swipeable } from "./Swipeable";
import { WorkoutItem } from "./WorkoutItem";
import Ionicon from "react-native-vector-icons/Ionicons";
import { setNewWorkoutModalData } from "../slices/UISlice";
import Animated from "react-native-reanimated";

interface WeekItemProps {
  week: weekData;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<number>>;
}

const rightSnapPoint = 140;
const snapPoints = [-100, 0, rightSnapPoint];

function weekHeader(week: weekData) {
  if (week.repeat) {
    return `Weeks ${week.position} - ${week.position + week.repeat}`;
  } else {
    return `Week ${week.position}`;
  }
}

export function WeekItem({ week, expanded, setExpanded }: WeekItemProps) {
  const dispatch = useAppDispatch();
  const weekTitle = weekHeader(week);

  function toggleExpand() {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 250,
    });
    if (!expanded) {
      setExpanded(week.position);
    } else {
      setExpanded(-1);
    }
  }

  function handleDelete() {
    LayoutAnimation.configureNext({
      update: {
        type: "easeInEaseOut",
        property: "scaleY",
        ...LayoutAnimation.Presets.easeInEaseOut.update,
      },
      duration: 300,
      delete: LayoutAnimation.Presets.easeInEaseOut.delete,
    });
    dispatch(deleteWeek(week.position));
  }

  return (
    <>
      <Swipeable
        snapPoints={snapPoints}
        height={70}
        mainAreaStyle={styles.weekItem}
        onPress={toggleExpand}
        rightArea={(translateX) => (
          <AnimatedSwipeButton
            snapPoint={snapPoints[0]}
            translateX={translateX}
            color="red"
            text="Delete"
            onPress={handleDelete}
            iconName="trash"
          />
        )}
        leftArea={(translateX) => (
          <WeekItemLeftButtons
            translateX={translateX}
            weekPosition={week.position}
            weekRepeat={week.repeat}
          />
        )}
      >
        <Text style={styles.itemText}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{weekTitle}</Text>
          {"\n"}
          {week.workouts.length} workout
          {week.workouts.length === 1 ? null : "s"}
        </Text>
      </Swipeable>
      {expanded ? (
        <WeekItemCollapsibleArea week={week} weekTitle={weekTitle} />
      ) : null}
    </>
  );
}

interface WeekItemCollapsibleAreaProps {
  week: weekData;
  weekTitle: string;
}

function WeekItemCollapsibleArea({
  week,
  weekTitle,
}: WeekItemCollapsibleAreaProps) {
  const dispatch = useAppDispatch();

  return (
    <View style={{ flex: 1 }}>
      {week.workouts.length !== 7 ? (
        <Button
          onPress={() => {
            dispatch(
              setNewWorkoutModalData({
                remainingDays: findRemainingWeekDays(week),
                weekPosition: week.position,
                weekTitle,
              })
            );
          }}
          color="lightgreen"
          style={styles.button}
        >
          <Ionicon name="add" size={18} />
          <Text style={styles.buttonText}>workout</Text>
        </Button>
      ) : null}
      {week.workouts.map((workout) => (
        <WorkoutItem
          workout={workout}
          weekPosition={week.position}
          weekTitle={weekTitle}
          key={workout.dayOfWeek}
        />
      ))}
    </View>
  );
}

interface WeekItemLeftButtonsProps {
  translateX: Animated.SharedValue<number>;
  weekPosition: weekData["position"];
  weekRepeat: weekData["repeat"];
}

function WeekItemLeftButtons({
  translateX,
  weekPosition,
  weekRepeat,
}: WeekItemLeftButtonsProps) {
  const dispatch = useAppDispatch();

  const operationValues = {
    increase: 1,
    decrease: -1,
  };

  function handleRepeatChange(op: keyof typeof operationValues): void {
    dispatch(
      changeWeekRepeat({
        weekPosition,
        newRepeat: weekRepeat + operationValues[op],
      })
    );
  }

  return (
    <>
      <AnimatedSwipeButton
        snapPoint={rightSnapPoint}
        translateX={translateX}
        color={primaryColor}
        iconName="add"
        text="repeat"
        onPress={() => {
          handleRepeatChange("increase");
        }}
      />
      <AnimatedSwipeButton
        snapPoint={rightSnapPoint}
        translateX={translateX}
        color={infoColor}
        iconName="remove"
        text="repeat"
        onPress={() => {
          handleRepeatChange("decrease");
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  weekItem: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    minHeight: 50,
  },
  itemText: {
    fontFamily: Helvetica,
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
  },
  workoutItem: {
    backgroundColor: "aliceblue",
    borderTopWidth: 0.2,
    height: 50,
    flex: 1,
    borderTopColor: "lightgrey",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  buttonText: {
    fontFamily: Helvetica,
    fontSize: 18,
    fontWeight: "300",
    color: "black",
    textAlignVertical: "center",
  },
  button: { borderRadius: 0, flexDirection: "row", alignItems: "center" },
});
