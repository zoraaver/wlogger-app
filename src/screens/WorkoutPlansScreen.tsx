import { useFocusEffect, useNavigation } from "@react-navigation/core";
import * as React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  LayoutAnimation,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "..";
import { Button } from "../components/Button";
import { HorizontalDivider } from "../components/HorizontalDivider";
import { WorkoutPlanItem } from "../components/WorkoutPlanItem";
import { WorkoutPlanNavigation } from "../navigators/WorkoutPlanStackNavigator";
import {
  getWorkoutPlans,
  setInitialWorkoutPlanData,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import { Helvetica, successColor } from "../util/constants";

export function WorkoutPlansScreen() {
  const dispatch = useAppDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getWorkoutPlans());
    }, [])
  );

  const workoutPlans: workoutPlanHeaderData[] = useAppSelector(
    (state) => state.workoutPlans.data
  );

  const dataPending = useAppSelector((state) => state.workoutPlans.dataPending);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.workoutPlansScreen}>
      {dataPending && !workoutPlans.length ? (
        <ActivityIndicator size="large" color="grey" />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={workoutPlans}
          keyExtractor={(workoutPlan) => workoutPlan._id}
          renderItem={(data) => (
            <WorkoutPlanItem workoutPlan={data.item} swipeable={true} />
          )}
          ItemSeparatorComponent={() => <HorizontalDivider />}
          ListFooterComponent={() => <HorizontalDivider />}
          ListHeaderComponent={() => <WorkoutPlanListHeader />}
          ListEmptyComponent={() => (
            <View style={styles.emptyListView}>
              <Text style={styles.labelText}>No plans found</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function WorkoutPlanListHeader() {
  const [newPlanInputVisible, setNewPlanInputVisible] = React.useState(false);
  const [newPlanName, setNewPlanName] = React.useState("");
  const dispatch = useAppDispatch();
  const navigation = useNavigation<WorkoutPlanNavigation>();

  function handleCreatePlan() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!newPlanInputVisible) {
      setNewPlanInputVisible(true);
    } else {
      if (newPlanName === "") {
        setNewPlanInputVisible(false);
      } else {
        dispatch(setInitialWorkoutPlanData(newPlanName));
        navigation.navigate("show", {
          workoutPlanName: newPlanName,
          id: undefined,
        });
      }
    }
  }

  return newPlanInputVisible ? (
    <>
      <View style={styles.inputArea}>
        <View style={styles.inputSection}>
          <Text style={styles.labelText}>Plan name: </Text>
          <TextInput
            value={newPlanName}
            style={styles.planInput}
            onChangeText={(value) => setNewPlanName(value)}
          />
        </View>
        <Button onPress={handleCreatePlan} color={successColor}>
          <Text style={styles.buttonText}>Next</Text>
        </Button>
      </View>
      <HorizontalDivider />
    </>
  ) : (
    <Button
      onPress={handleCreatePlan}
      color="lightgreen"
      style={styles.addPlanButton}
    >
      <Text style={{ fontSize: 18, fontFamily: Helvetica }}>+ plan</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  workoutPlansScreen: {
    flex: 1,
    backgroundColor: "lightyellow",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  planInput: {
    backgroundColor: "white",
    height: 40,
    borderWidth: 0.7,
    borderRadius: 10,
    paddingLeft: 15,
    fontFamily: Helvetica,
    flex: 1,
    marginVertical: 10,
    fontSize: 18,
  },
  inputArea: {
    paddingHorizontal: 20,
    marginVertical: 20,
    justifyContent: "space-evenly",
  },
  inputSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  labelText: {
    fontSize: 18,
    fontFamily: Helvetica,
  },
  addPlanButton: {
    borderRadius: 0,
  },
  emptyListView: {
    flex: 1,
    backgroundColor: "aliceblue",
    alignItems: "center",
    height: 50,
    justifyContent: "center",
  },
});
