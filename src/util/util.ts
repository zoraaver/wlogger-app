import { Linking, AlertButton, Alert, Platform } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import RNFetchBlob from "rn-fetch-blob";
import {
  weekData,
  weightUnit,
  workoutPlanData,
  workoutPlanHeaderData,
} from "../slices/workoutPlansSlice";
import { incrementField } from "../slices/workoutsSlice";
import AndroidOpenSettings from "react-native-android-open-settings";

export function renderRestInterval(
  seconds?: number,
  displayZeroSeconds?: boolean
) {
  if (displayZeroSeconds && seconds === 0) return "00:00";
  if (!seconds) return "-";
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

export function extractTokenFromSetCookieHeaders(
  responseHeaders: string[]
): string {
  for (const header of responseHeaders) {
    const tokenField: string = header.split(";", 1)[0];
    const [fieldName, token] = tokenField.split("=");
    if (fieldName === "token") return token;
  }
  throw new Error("Token not found in set cookie headers");
}

export function getToken() {
  return EncryptedStorage.getItem("token");
}

export async function getFileStats(path: string) {
  const stats = await RNFetchBlob.fs.stat(path);
  const fileExtension = stats.filename.split(".").pop();
  return { ...stats, type: extensionToMime[fileExtension || ""] };
}

const extensionToMime: { [extension: string]: string } = {
  avi: "video/x-msvideo",
  mp4: "video/mp4",
  mov: "video/quicktime",
};

export function DDMMYYYYDateFormat(date: Date | string | undefined): string {
  if (date === undefined) return "-";
  let dateToFormat: Date;
  if (typeof date === "string") {
    dateToFormat = new Date(date);
  } else {
    dateToFormat = date;
  }
  const years = dateToFormat.getFullYear();
  let month: string | number = dateToFormat.getMonth() + 1;
  let days: string | number = dateToFormat.getDate();
  if (month < 10) month = "0" + month;
  if (days < 10) days = "0" + days;
  return `${days}/${month}/${years}`;
}

export async function NoInternetAlert() {
  const alertButtons: AlertButton[] = [{ text: "Ok" }];

  const canOpenOSSettings = await openOSSettings();

  if (canOpenOSSettings !== undefined) {
    alertButtons.push({
      text: "Settings",
      onPress: canOpenOSSettings,
    });
  }

  const title = "No internet connection";
  const message =
    "An internet connection is required for this app - please enable wifi or cellular if they are disabled.";

  Alert.alert(title, message, alertButtons);
}

async function openOSSettings(): Promise<(() => void) | undefined> {
  if (Platform.OS === "ios") {
    let canOpenWifiSettings: boolean = false;

    const networkSettingsUrl = "App-Prefs:root=WIFI";

    try {
      canOpenWifiSettings = await Linking.canOpenURL(networkSettingsUrl);
    } catch (error) {}

    if (canOpenWifiSettings) return () => Linking.openURL(networkSettingsUrl);
  } else if (Platform.OS === "android") {
    return AndroidOpenSettings.airplaneModeSettings;
  }
}

export function sortedIndex<T>(
  array: Array<T>,
  value: T,
  isLessThan: (a: T, b: T) => boolean = (a, b) => a < b
): number {
  let low = 0;
  let high = array.length;

  while (low < high) {
    let mid = (low + high) >>> 1;

    if (isLessThan(array[mid], value)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}
