import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { useAppDispatch } from "..";
import { deleteWeek, totalSets, weekData } from "../slices/workoutPlansSlice";
import { workoutData } from "../slices/workoutsSlice";
import { Helvetica } from "../util/constants";
import { AnimatedSwipeButton } from "./AnimatedSwipeButton";
import { Collapsible } from "./Collapsible";
import { Swipeable } from "./Swipeable";

interface WeekItemProps {
  week: weekData;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<number>>;
}

const snapPoints = [-100, 0];
const workoutItemHeight = 50;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

export function WeekItem({ week, expanded, setExpanded }: WeekItemProps) {
  const workoutDaysHeight = week.workouts.length * workoutItemHeight;
  const dispatch = useAppDispatch();

  function weekHeader() {
    if (week.repeat) {
      return `Weeks ${week.position} - ${week.position + week.repeat}`;
    } else {
      return `Week ${week.position}`;
    }
  }

  function toggleExpand() {
    if (!expanded) {
      setExpanded(week.position);
    } else {
      setExpanded(-1);
    }
  }

  function handleDelete() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
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
            leftSnapPoint={snapPoints[0]}
            translateX={translateX}
            color="red"
            text="Delete"
            onPress={handleDelete}
            iconName="trash"
          />
        )}
      >
        <Text style={styles.itemText}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {weekHeader()}
          </Text>
          {"\n"}
          {week.workouts.length} workout
          {week.workouts.length === 1 ? null : "s"}
        </Text>
      </Swipeable>
      <Collapsible initialHeight={workoutDaysHeight} collapsed={!expanded}>
        <View style={{ flex: 1 }}>
          {week.workouts.map((workout) => (
            <WorkoutItem workout={workout} key={workout.dayOfWeek} />
          ))}
        </View>
      </Collapsible>
    </>
  );
}

interface WorkoutItemProps {
  workout: workoutData;
}

function WorkoutItem({ workout }: WorkoutItemProps) {
  const totalNumberOfSets = totalSets(workout);
  return (
    <View key={workout.dayOfWeek} style={styles.workoutItem}>
      <Text style={styles.itemText}>
        <Text style={{ fontWeight: "bold" }}>{workout.dayOfWeek}: </Text>
        {workout.exercises.length} exercise
        {workout.exercises.length === 1 ? null : "s"}, {totalNumberOfSets} set
        {totalNumberOfSets === 1 ? null : "s"}
      </Text>
    </View>
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
    maxHeight: workoutItemHeight,
    flex: 1,
    borderTopColor: "lightgrey",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  itemHeaderText: {},
});
