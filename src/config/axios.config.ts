import axios from "axios";
import { Platform } from "react-native";

const backendUrl: string = "https://wlogger.uk/api";
const developmentUrl: string =
  Platform.OS === "ios" ? "http://localhost:8080" : "http://10.0.2.2:8080";

export const baseURL =
  process.env.NODE_ENV === "production" ? backendUrl : developmentUrl;

export const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});
