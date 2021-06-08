import { useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { HorizontalDivider } from "../components/HorizontalDivider";
import { NewWorkoutModal } from "../components/NewWorkoutModal";
import { WeekItem } from "../components/WeekItem";
import { WorkoutPlanStackParamList } from "../navigators/WorkoutPlanStackNavigator";
import {
  addWeek,
  getWorkoutPlan,
  patchStartWorkoutPlan,
  patchWorkoutPlan,
  postWorkoutPlan,
  weekData,
  workoutPlanData,
} from "../slices/workoutPlansSlice";
import { Helvetica, successColor } from "../util/constants";
import { DDMMYYYYDateFormat } from "../util/util";
import { LoadingScreen } from "./LoadingScreen";

type WorkoutPlanScreenRouteProp = RouteProp<WorkoutPlanStackParamList, "show">;

export function WorkoutPlanScreen() {
  const dispatch = useAppDispatch();
  const {
    params: { id },
  } = useRoute<WorkoutPlanScreenRouteProp>();
  const workoutPlan = useAppSelector(
    (state) => state.workoutPlans.editWorkoutPlan
  );

  React.useEffect(() => {
    if (id) {
      dispatch(getWorkoutPlan(id));
    }
  }, [id]);

  const { newWorkoutModalData } = useAppSelector((state) => state.UI);
  const newWorkoutModalVisible = newWorkoutModalData !== undefined;

  const weekItemListRef = React.useRef<FlatList>(null);

  function handleAddWeek() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(addWeek());
    weekItemListRef.current?.scrollToEnd();
  }

  if (id && workoutPlan?._id !== id)
    return <LoadingScreen backgroundColor="powderblue" />;

  return (
    <>
      <NewWorkoutModal
        visible={newWorkoutModalVisible}
        remainingDays={newWorkoutModalData?.remainingDays}
        weekPosition={newWorkoutModalData?.weekPosition}
        weekTitle={newWorkoutModalData?.weekTitle}
      />
      <View
        style={[
          styles.workoutPlanScreen,
          {
            opacity: newWorkoutModalVisible ? 0.2 : undefined,
          },
        ]}
      >
        {workoutPlan ? (
          <>
            <WorkoutPlanDetails workoutPlan={workoutPlan} />
            <WeekItemList
              weeks={workoutPlan.weeks}
              weekItemListRef={weekItemListRef}
            />
          </>
        ) : (
          <ActivityIndicator size="large" color="black" />
        )}
        <WorkoutPlanControls
          workoutPlan={workoutPlan}
          handleAddWeek={handleAddWeek}
        />
      </View>
    </>
  );
}

interface WeekItemListProps {
  weeks: weekData[];
  weekItemListRef: React.RefObject<FlatList<any>>;
}

function WeekItemList({ weeks, weekItemListRef }: WeekItemListProps) {
  const [expandedWeek, setExpandedWeek] = React.useState(-1);
  return (
    <FlatList
      style={{
        flex: 1,
        backgroundColor: "powderblue",
      }}
      data={weeks}
      renderItem={({ item: week }) => (
        <WeekItem
          week={week}
          expanded={expandedWeek === week.position}
          setExpanded={setExpandedWeek}
        />
      )}
      keyExtractor={(week) => week.position.toString()}
      ItemSeparatorComponent={() => <HorizontalDivider />}
      extraData={expandedWeek}
      ListFooterComponent={() => (weeks.length ? <HorizontalDivider /> : null)}
      ref={weekItemListRef}
    />
  );
}

interface WorkoutPlanDetailsProps {
  workoutPlan: workoutPlanData;
}

function WorkoutPlanDetails({ workoutPlan }: WorkoutPlanDetailsProps) {
  return (
    <View style={styles.planDetails}>
      <View>
        <Text style={styles.planDetailsText}>
          <Text style={styles.detailLabel}>Status:</Text> {workoutPlan.status}
          {"\n"}
          <Text style={styles.detailLabel}>Length: </Text>
          {workoutPlan.length} week
          {workoutPlan.length === 1 ? null : "s"}
        </Text>
      </View>
      <View>
        <Text style={styles.planDetailsText}>
          <Text style={styles.detailLabel}>Start date: </Text>
          {workoutPlan.status === "Not started"
            ? "-"
            : DDMMYYYYDateFormat(workoutPlan.start)}
          {"\n"}
          <Text style={styles.detailLabel}>End date: </Text>
          {workoutPlan?.status === "Completed"
            ? DDMMYYYYDateFormat(workoutPlan.end)
            : "-"}
        </Text>
      </View>
    </View>
  );
}

interface WorkoutPlanControlsProps {
  workoutPlan?: workoutPlanData;
  handleAddWeek: () => void;
}

function WorkoutPlanControls({
  workoutPlan,
  handleAddWeek,
}: WorkoutPlanControlsProps) {
  const planUpdateInProgress = useAppSelector(
    (state) => state.workoutPlans.planUpdateInProgress
  );
  const dispatch = useAppDispatch();

  function handleSave() {
    if (workoutPlan?._id) {
      dispatch(patchWorkoutPlan(workoutPlan));
    } else if (workoutPlan) {
      dispatch(postWorkoutPlan(workoutPlan));
    }
  }
  function handleStart() {
    if (workoutPlan?._id) {
      dispatch(patchStartWorkoutPlan(workoutPlan._id));
    }
  }

  return (
    <View style={styles.controls}>
      <Button
        onPress={handleAddWeek}
        color={successColor}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add week</Text>
      </Button>
      {workoutPlan?.status === "In progress" || !workoutPlan?._id ? null : (
        <Button onPress={handleStart} style={styles.button}>
          <Text style={styles.buttonText}>Start Plan</Text>
        </Button>
      )}
      <Button onPress={handleSave} style={styles.button}>
        {planUpdateInProgress ? (
          <ActivityIndicator size="small" color="aliceblue" />
        ) : (
          <Text style={styles.buttonText}>
            {workoutPlan?._id ? "Save changes" : "Create"}
          </Text>
        )}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutPlanScreen: { flex: 1, backgroundColor: "powderblue" },
  buttonText: { fontFamily: Helvetica, color: "white", fontSize: 18 },
  controls: {
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: { marginBottom: 10 },
  planDetails: {
    backgroundColor: "lightyellow",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    borderBottomWidth: 0.6,
    borderBottomColor: "lightgrey",
  },
  planDetailsText: {
    fontFamily: Helvetica,
    fontSize: 18,
    lineHeight: 35,
  },
  detailLabel: {
    fontWeight: "bold",
  },
});
