import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { API } from "../config/axios.config";
import { calculateLength } from "../util/util";
import { exerciseData, workoutData } from "./workoutsSlice";

export const workoutPlansUrl = "/workoutPlans";
export type workoutPlanStatus = "In progress" | "Completed" | "Not started";

export interface workoutPlanData {
  start?: string;
  end?: string;
  _id?: string;
  name: string;
  length?: number;
  status: workoutPlanStatus;
  weeks: Array<weekData>;
}

export interface weekData {
  position: number;
  workouts: Array<workoutData>;
  repeat: number;
}

export type weightUnit = "kg" | "lb";

export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Day = typeof weekDays[number];

export interface workoutPlanHeaderData {
  name: string;
  length: number;
  status: workoutPlanStatus;
  start?: string;
  end?: string;
  weeks: Array<weekData>;
  _id: string;
}

const daysToNumbers: { [dayOfWeek: string]: number } = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

interface workoutPlanState {
  data: Array<workoutPlanHeaderData>;
  error: string | undefined;
  editWorkoutPlan: workoutPlanData | undefined;
  currentPlan?: workoutPlanHeaderData;
  success: string | undefined;
  planUpdateInProgress?: boolean;
  dataPending?: boolean;
}

export const postWorkoutPlan = createAsyncThunk(
  "workoutPlans/postWorkoutPlan",
  async (data: workoutPlanData) => {
    try {
      const response: AxiosResponse<workoutPlanData> = await API.post(
        workoutPlansUrl,
        data
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const getWorkoutPlans = createAsyncThunk(
  "workoutPlans/getWorkoutPlans",
  async () => {
    try {
      const response: AxiosResponse<workoutPlanHeaderData[]> = await API.get(
        workoutPlansUrl
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const getWorkoutPlan = createAsyncThunk(
  "workoutPlans/getWorkoutPlan",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<workoutPlanData> = await API.get(
        `${workoutPlansUrl}/${_id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const patchWorkoutPlan = createAsyncThunk(
  "workoutPlans/patchWorkoutPlan",
  async (workoutPlanData: workoutPlanData, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<workoutPlanData> = await API.patch(
        `${workoutPlansUrl}/${workoutPlanData._id}`,
        workoutPlanData
      );
      return response.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const deleteWorkoutPlan = createAsyncThunk(
  "workoutPlans/deleteWorkoutPlan",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<workoutPlanData["_id"]> = await API.delete(
        `${workoutPlansUrl}/${_id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const patchStartWorkoutPlan = createAsyncThunk(
  "workoutPlans/patchStartWorkoutPlan",
  async (_id: string) => {
    try {
      const response: AxiosResponse<{
        id: string;
        start: string;
      }> = await API.patch(`${workoutPlansUrl}/start/${_id}`);
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const getCurrentPlan = createAsyncThunk(
  "workoutPlans/getCurrentPlan",
  async () => {
    try {
      const response: AxiosResponse<workoutPlanHeaderData> = await API.get(
        `${workoutPlansUrl}/current`
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const resetSuccess = createAsyncThunk(
  "workoutPlans/resetSuccess",
  async (seconds: number, { dispatch }) => {
    setTimeout(() => {
      dispatch(setSuccess(undefined));
    }, 1000 * seconds);
  }
);
export const resetError = createAsyncThunk(
  "workoutPlans/resetError",
  async (seconds: number, { dispatch }) => {
    setTimeout(() => {
      dispatch(setError(undefined));
    }, 1000 * seconds);
  }
);

const initialState: workoutPlanState = {
  data: [],
  editWorkoutPlan: undefined,
  success: undefined,
  error: undefined,
};

interface WorkoutPosition {
  weekPosition: number;
  day: Day;
}

type ExercisePosition = WorkoutPosition & { exerciseIndex: number };

const slice = createSlice({
  name: "workoutPlans",
  initialState,
  reducers: {
    setInitialWorkoutPlanData(
      state,
      action: PayloadAction<workoutPlanData | string>
    ) {
      if (typeof action.payload === "string") {
        state.editWorkoutPlan = {
          name: action.payload,
          status: "Not started",
          weeks: [],
        };
      } else {
        state.editWorkoutPlan = action.payload;
      }
      state.editWorkoutPlan.length = 0;
    },
    addWeek(state, action: PayloadAction<weekData | undefined>) {
      if (!state.editWorkoutPlan) return;
      if (action.payload) {
        state.editWorkoutPlan.weeks.push(action.payload);
      } else {
        const nextWeekPosition = calculateLength(state.editWorkoutPlan) + 1;
        state.editWorkoutPlan.weeks.push({
          position: nextWeekPosition,
          repeat: 0,
          workouts: [],
        });
      }
      state.editWorkoutPlan.length = calculateLength(state.editWorkoutPlan);
    },
    addWorkout(state, action: PayloadAction<WorkoutPosition>) {
      const { weekPosition, day } = action.payload;
      const weekIndex:
        | number
        | undefined = state.editWorkoutPlan?.weeks.findIndex(
        (week: weekData) => week.position === weekPosition
      );
      if (weekIndex !== undefined && weekIndex >= 0) {
        state.editWorkoutPlan?.weeks[weekIndex].workouts.push({
          dayOfWeek: day,
          exercises: [],
        });
        state.editWorkoutPlan?.weeks[weekIndex].workouts.sort(
          (a, b) => daysToNumbers[a.dayOfWeek] - daysToNumbers[b.dayOfWeek]
        );
      }
    },
    addExercise(
      state,
      action: PayloadAction<
        WorkoutPosition & {
          exerciseData: exerciseData;
        }
      >
    ) {
      const { weekPosition, day, exerciseData } = action.payload;
      const weekIndex:
        | number
        | undefined = state.editWorkoutPlan?.weeks.findIndex(
        (week: weekData) => week.position === weekPosition
      );
      if (weekIndex !== undefined && weekIndex >= 0) {
        const workout = state.editWorkoutPlan?.weeks[weekIndex].workouts.find(
          (w: workoutData) => w.dayOfWeek === day
        );
        if (workout) {
          exerciseData.addedInCurrentSession = true;
          workout.exercises.push(exerciseData);
        }
      }
    },
    updateExercise(
      state,
      action: PayloadAction<
        ExercisePosition & { updatedExercise: exerciseData }
      >
    ) {
      const {
        weekPosition,
        day,
        exerciseIndex,
        updatedExercise,
      } = action.payload;
      const week = state.editWorkoutPlan?.weeks.find(
        (week: weekData) => week.position === weekPosition
      );
      const workout = week?.workouts.find(
        (workout) => workout.dayOfWeek === day
      );
      workout?.exercises.splice(exerciseIndex, 1, updatedExercise);
    },
    deleteExercise(state, action: PayloadAction<ExercisePosition>) {
      const { weekPosition, day, exerciseIndex } = action.payload;
      const week = state.editWorkoutPlan?.weeks.find(
        (week: weekData) => week.position === weekPosition
      );
      if (week !== undefined) {
        const workout = week.workouts.find(
          (workout: workoutData) => workout.dayOfWeek === day
        );
        if (workout !== undefined) {
          workout.exercises.splice(exerciseIndex, 1);
        }
      }
    },
    deleteWeek(state, action: PayloadAction<number>) {
      const position: number = action.payload;
      if (!state.editWorkoutPlan) return;
      const weeks = state.editWorkoutPlan.weeks;
      const weekToDeleteIndex = weeks.findIndex(
        (week: weekData) => week.position === position
      );
      if (weekToDeleteIndex !== undefined && weekToDeleteIndex >= 0) {
        weeks.forEach((week: weekData) => {
          if (week.position > weeks[weekToDeleteIndex].position) {
            week.position = week.position - 1 - weeks[weekToDeleteIndex].repeat;
          }
        });
        state.editWorkoutPlan.weeks.splice(weekToDeleteIndex, 1);
        state.editWorkoutPlan.length = calculateLength(state.editWorkoutPlan);
      }
    },
    deleteWorkout(state, action: PayloadAction<WorkoutPosition>) {
      if (!state.editWorkoutPlan) return;
      const { weekPosition, day } = action.payload;
      const week = state.editWorkoutPlan.weeks.find(
        (week: weekData) => week.position === weekPosition
      );
      if (week !== undefined) {
        const workoutToDeleteIndex = week.workouts.findIndex(
          (workout: workoutData) => workout.dayOfWeek === day
        );
        if (workoutToDeleteIndex !== undefined && workoutToDeleteIndex >= 0) {
          week.workouts.splice(workoutToDeleteIndex, 1);
        }
      }
    },
    deleteEmptyWorkouts(state, action: PayloadAction<number>) {
      if (!state.editWorkoutPlan) return;
      const postion: number = action.payload;
      const week = state.editWorkoutPlan.weeks.find(
        (week: weekData) => week.position === postion
      );
      if (week !== undefined) {
        week.workouts = week.workouts.filter(
          (workout: workoutData) => workout.exercises.length !== 0
        );
      }
    },
    changeWeekRepeat(
      state,
      action: PayloadAction<{ weekPosition: number; newRepeat: number }>
    ) {
      if (!state.editWorkoutPlan) return;
      const { weekPosition, newRepeat } = action.payload;
      if (newRepeat < 0) return;
      const weekToChange:
        | weekData
        | undefined = state.editWorkoutPlan.weeks.find(
        (week: weekData) => week.position === weekPosition
      );
      if (!weekToChange) return;
      state.editWorkoutPlan.weeks.forEach((week: weekData) => {
        if (week.position > weekToChange.position) {
          week.position = week.position + (newRepeat - weekToChange.repeat);
        }
      });
      weekToChange.repeat = newRepeat;
      state.editWorkoutPlan.length = calculateLength(state.editWorkoutPlan);
    },
    setSuccess(state, action: PayloadAction<string | undefined>) {
      state.success = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      postWorkoutPlan.fulfilled,
      (state, action: PayloadAction<workoutPlanData>) => {
        state.success = `${action.payload.name} successfully created`;
        state.editWorkoutPlan = action.payload;
        state.editWorkoutPlan.length = calculateLength(state.editWorkoutPlan);
      }
    );

    builder.addCase(postWorkoutPlan.rejected, (state, action) => {
      state.success = undefined;
    });

    builder.addCase(getWorkoutPlans.fulfilled, (state, action) => {
      state.data = action.payload;
      state.data.forEach((plan: workoutPlanHeaderData) => {
        plan.length = calculateLength(plan);
      });
      state.dataPending = false;
    });

    builder.addCase(getWorkoutPlans.pending, (state) => {
      state.dataPending = true;
    });

    builder.addCase(getWorkoutPlans.rejected, (state) => {
      state.dataPending = false;
    });

    builder.addCase(
      getWorkoutPlan.fulfilled,
      (state, action: PayloadAction<workoutPlanData>) => {
        state.editWorkoutPlan = action.payload;
        state.editWorkoutPlan.length = calculateLength(state.editWorkoutPlan);
        state.error = undefined;
      }
    );
    builder.addCase(
      getWorkoutPlan.rejected,
      (state, action: PayloadAction<unknown>) => {
        state.editWorkoutPlan = undefined;
        state.error = (action.payload as { message: string }).message;
      }
    );
    builder.addCase(
      patchWorkoutPlan.fulfilled,
      (state, action: PayloadAction<workoutPlanData>) => {
        state.editWorkoutPlan = action.payload;
        state.editWorkoutPlan.length = calculateLength(state.editWorkoutPlan);
        state.success = `${action.payload.name} successfully updated`;
        state.error = undefined;
        state.planUpdateInProgress = false;
      }
    );
    builder.addCase(
      patchWorkoutPlan.rejected,
      (state, action: PayloadAction<unknown>) => {
        state.editWorkoutPlan = undefined;
        state.error = (action.payload as { message: string }).message;
        state.planUpdateInProgress = false;
      }
    );
    builder.addCase(patchWorkoutPlan.pending, (state) => {
      state.planUpdateInProgress = true;
    });
    builder.addCase(
      deleteWorkoutPlan.fulfilled,
      (state, action: PayloadAction<workoutPlanData["_id"]>) => {
        state.editWorkoutPlan = undefined;
        state.data = state.data.filter(
          (workoutPlanHeader: workoutPlanHeaderData) =>
            workoutPlanHeader._id !== action.payload
        );
        state.success = `Plan successfully deleted`;
        state.error = undefined;
      }
    );
    builder.addCase(
      deleteWorkoutPlan.rejected,
      (state, action: PayloadAction<unknown>) => {
        state.editWorkoutPlan = undefined;
        state.error = (action.payload as { message: string }).message;
      }
    );
    builder.addCase(
      patchStartWorkoutPlan.fulfilled,
      (state, action: PayloadAction<{ id: string; start: string }>) => {
        const previousPlan = state.data.find(
          (plan: workoutPlanHeaderData) => plan.status === "In progress"
        );
        if (previousPlan !== undefined) previousPlan.status = "Not started";
        const currentPlan = state.data.find(
          (plan: workoutPlanHeaderData) => plan._id === action.payload.id
        );
        if (currentPlan) {
          currentPlan.status = "In progress";
          currentPlan.start = action.payload.start;
          // update plan being edited if necessary
          if (currentPlan._id === state.editWorkoutPlan?._id) {
            state.editWorkoutPlan.status = "In progress";
            state.editWorkoutPlan.start = action.payload.start;
          }
        }
      }
    );
    builder.addCase(patchStartWorkoutPlan.rejected, (state, action) => {
      state.success = undefined;
      state.error = action.error.message;
    });
    builder.addCase(getCurrentPlan.fulfilled, (state, action) => {
      state.error = undefined;
      state.currentPlan = action.payload;
      state.currentPlan.length = calculateLength(state.currentPlan);
    });
    builder.addCase(getCurrentPlan.rejected, (state, action) => {
      state.currentPlan = undefined;
    });
  },
});

export function totalSets(workout: workoutData): number {
  return workout.exercises.reduce((acc, curr) => acc + curr.sets, 0);
}

export function findRemainingWeekDays(week: weekData | undefined): Day[] {
  const takenDays = week?.workouts.map((workout) => workout.dayOfWeek);
  return weekDays.filter((weekDay) => !takenDays?.includes(weekDay));
}

export const workoutPlansReducer = slice.reducer;
export const {
  setInitialWorkoutPlanData,
  addWeek,
  addWorkout,
  addExercise,
  updateExercise,
  deleteExercise,
  deleteWeek,
  deleteWorkout,
  deleteEmptyWorkouts,
  setSuccess,
  setError,
  changeWeekRepeat,
} = slice.actions;
