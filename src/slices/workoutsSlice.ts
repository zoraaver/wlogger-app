import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { API } from "../config/axios.config";
import { weightUnit, Day, workoutPlansUrl } from "./workoutPlansSlice";

export type incrementField = "weight" | "repetitions" | "sets";
export const incrementFields: incrementField[] = [
  "repetitions",
  "sets",
  "weight",
];

export interface exerciseData {
  name: string;
  restInterval?: number;
  sets: number;
  repetitions?: number;
  weight?: number;
  unit: weightUnit;
  _id?: string;
  autoIncrement?: { field: incrementField; amount: number };
}

export interface workoutData {
  dayOfWeek: Day;
  date?: string;
  _id?: string;
  exercises: Array<exerciseData>;
}

export const getNextWorkout = createAsyncThunk(
  "workouts/getNextWorkout",
  async () => {
    try {
      const response: AxiosResponse<workoutData | string> = await API.get(
        `${workoutPlansUrl}/nextWorkout`
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error.response);
    }
  }
);

interface workoutState {
  nextWorkout?: workoutData;
  message?: string;
}

const initialState: workoutState = {};

const slice = createSlice({
  initialState,
  name: "workouts",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getNextWorkout.fulfilled,
      (state, action: PayloadAction<workoutData | string>) => {
        if (typeof action.payload === "string") {
          state.message = action.payload;
          state.nextWorkout = undefined;
        } else {
          state.nextWorkout = action.payload;
          state.message = undefined;
        }
      }
    );
    builder.addCase(getNextWorkout.rejected, (state, action) => {
      state.nextWorkout = undefined;
      state.message = action.error.message;
    });
  },
});

export const workoutsReducer = slice.reducer;
