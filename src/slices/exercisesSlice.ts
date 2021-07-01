import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { RootState } from "..";
import { API } from "../config/axios.config";
import { sortedIndex } from "../util/util";

const exercisesUrl = "/exercises";

export interface exerciseData {
  name: string;
  notes?: string;
  _id?: string;
}

export const getExercises = createAsyncThunk(
  "exercises/getExercises",
  async () => {
    try {
      const response: AxiosResponse<exerciseData[]> = await API.get(
        exercisesUrl
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const postExercise = createAsyncThunk(
  "exercises/postExercise",
  async (data: exerciseData) => {
    try {
      const response: AxiosResponse<exerciseData> = await API.post(
        exercisesUrl,
        data
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const deleteExercise = createAsyncThunk(
  "exercises/deleteExercise",
  async (id: string) => {
    try {
      const response: AxiosResponse<string> = await API.delete(
        `${exercisesUrl}/${id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const patchExercise = createAsyncThunk(
  "exercises/patchExercise",
  async (data: exerciseData) => {
    try {
      const response: AxiosResponse<exerciseData> = await API.patch(
        `${exercisesUrl}/${data._id}`,
        data
      );
      return response.data;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

interface exercisesSliceState {
  data: exerciseData[];
}

const initialState: exercisesSliceState = { data: [] };

const slice = createSlice({
  initialState,
  name: "exercises",
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(
      getExercises.fulfilled,
      (state, action: PayloadAction<exerciseData[]>) => {
        state.data = action.payload;
      }
    );

    addCase(getExercises.rejected, (_, action) => {
      console.error(action.error.message);
    });

    addCase(
      postExercise.fulfilled,
      (state, action: PayloadAction<exerciseData>) => {
        const sortedExerciseIndex = sortedIndex(
          state.data,
          action.payload,
          (a, b) => a.name.localeCompare(b.name) <= 0
        );

        state.data.splice(sortedExerciseIndex, 0, action.payload);
      }
    );
    addCase(postExercise.rejected, (_, action) => {
      console.error(action.error.message);
    });

    addCase(deleteExercise.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (exercise) => exercise._id !== action.payload
      );
    });

    addCase(deleteExercise.rejected, (_, action) => {
      console.error(action.error.message);
    });

    addCase(
      patchExercise.fulfilled,
      (state, { payload: updatedExercise }: PayloadAction<exerciseData>) => {
        const exerciseIndex: number = state.data.findIndex(
          (exercise) => exercise._id === updatedExercise._id
        );

        if (exerciseIndex >= 0) {
          state.data[exerciseIndex] = updatedExercise;
        }
      }
    );

    addCase(patchExercise.rejected, (_, action) => {
      console.error(action.error.message);
    });
  },
});

// selectors

export const exerciseNamesSelector = (state: RootState) =>
  state.exercises.data.map((exercise) => exercise.name);

export const exercisesReducer = slice.reducer;

export const {} = slice.actions;
