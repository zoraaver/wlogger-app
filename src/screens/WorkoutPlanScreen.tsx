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
import { SafeAreaView } from "react-native-safe-area-context";
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
  workoutPlanData,
} from "../slices/workoutPlansSlice";
import { Helvetica, successColor } from "../util/constants";
import { DDMMYYYYDateFormat } from "../util/util";

type WorkoutPlanScreenRouteProp = RouteProp<WorkoutPlanStackParamList, "show">;

export function WorkoutPlanScreen() {
  const dispatch = useAppDispatch();
  const {
    params: { _id },
  } = useRoute<WorkoutPlanScreenRouteProp>();
  const workoutPlan = useAppSelector(
    (state) => state.workoutPlans.editWorkoutPlan
  );

  React.useEffect(() => {
    dispatch(getWorkoutPlan(_id));
  }, [_id]);

  const [expandedWeek, setExpandedWeek] = React.useState(-1);

  const weekItemListRef = React.useRef<FlatList>(null);

  const { newWorkoutModalData } = useAppSelector((state) => state.UI);
  const newWorkoutModalVisible = newWorkoutModalData !== undefined;

  const planUpdateInProgress = useAppSelector(
    (state) => state.workoutPlans.planUpdateInProgress
  );

  function handleAddWeek() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(addWeek());
    weekItemListRef.current?.scrollToEnd();
  }

  function handleSave() {
    if (workoutPlan) {
      dispatch(patchWorkoutPlan(workoutPlan));
    }
  }
  function handleStart() {
    if (workoutPlan?._id) {
      dispatch(patchStartWorkoutPlan(workoutPlan._id));
    }
  }

  return (
    <>
      <NewWorkoutModal
        visible={newWorkoutModalVisible}
        remainingDays={newWorkoutModalData?.remainingDays}
        weekPosition={newWorkoutModalData?.weekPosition}
        weekTitle={newWorkoutModalData?.weekTitle}
      />
      <SafeAreaView
        edges={["bottom", "left", "right"]}
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
            <FlatList
              style={{
                flex: 1,
                backgroundColor: "aliceblue",
                marginBottom: 10,
              }}
              data={workoutPlan.weeks}
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
              ListFooterComponent={() =>
                workoutPlan.weeks.length ? <HorizontalDivider /> : null
              }
              ref={weekItemListRef}
            />
          </>
        ) : (
          <ActivityIndicator size="large" color="black" />
        )}
        <View style={styles.controls}>
          <Button
            onPress={handleAddWeek}
            color={successColor}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Add week</Text>
          </Button>
          {workoutPlan?.status === "In progress" ? null : (
            <Button onPress={handleStart} style={styles.button}>
              <Text style={styles.buttonText}>Start Plan</Text>
            </Button>
          )}
          <Button onPress={handleSave} style={styles.button}>
            {planUpdateInProgress ? (
              <ActivityIndicator size="small" color="aliceblue" />
            ) : (
              <Text style={styles.buttonText}>Save changes</Text>
            )}
          </Button>
        </View>
      </SafeAreaView>
    </>
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

const styles = StyleSheet.create({
  workoutPlanScreen: { flex: 1, backgroundColor: "powderblue" },
  buttonText: { fontFamily: Helvetica, color: "white", fontSize: 18 },
  controls: { justifyContent: "space-evenly", paddingHorizontal: 20 },
  button: { marginBottom: 10 },
  planDetails: {
    backgroundColor: "lightyellow",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    borderBottomWidth: 0.3,
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
