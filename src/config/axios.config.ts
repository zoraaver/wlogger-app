import axios from "axios";
import { Platform } from "react-native";
import { getToken } from "../util/util";
import {
  BACKEND_PRODUCTION_URL,
  IOS_DEV_URL,
  ANDROID_DEV_URL,
} from "./keys.json";

export const backendUrl: string = BACKEND_PRODUCTION_URL;
const developmentUrl: string =
  Platform.OS === "ios" ? IOS_DEV_URL : ANDROID_DEV_URL;

export const baseURL =
  process.env.NODE_ENV === "production" ? backendUrl : developmentUrl;

export const API = axios.create({ baseURL });

API.interceptors.request.use(async (config) => {
  try {
    config.headers["Authorisation"] = await getToken();
  } catch (error) {}
  return config;
});
