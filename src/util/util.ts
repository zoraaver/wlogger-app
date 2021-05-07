import {
  weekData,
  weightUnit,
  workoutPlanData,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import { incrementField } from "../slices/workoutsSlice";

export function renderRestInterval(seconds?: number) {
  if (seconds === undefined) return "-";
  seconds = Math.round(seconds);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  const minutesString: string =
    minutes < 10 ? "0" + minutes : minutes.toString();
  const secondsString: string =
    seconds < 10 ? "0" + seconds : seconds.toString();
  return minutesString + ":" + secondsString;
}

export function calculateLength(
  workoutPlanData: workoutPlanData | workoutPlanHeaderData
): number {
  if (workoutPlanData.weeks.length === 0) return 0;
  const lastWeek: weekData =
    workoutPlanData.weeks[workoutPlanData.weeks.length - 1];
  return lastWeek.repeat + lastWeek.position;
}

export function isToday(date: Date): boolean {
  const today: Date = new Date(Date.now());
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function isTomorrow(date: Date): boolean {
  const today: Date = new Date(Date.now());
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate() + 1
  );
}

export function renderAutoIncrementField(
  field: incrementField,
  unit: weightUnit
): string {
  switch (field) {
    case "repetitions":
      return "reps";
    case "weight":
      return unit;
    case "sets":
      return "sets";
  }
}
