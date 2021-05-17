import axios from "axios";
import { Platform } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

const backendUrl: string = "https://wlogger.uk/api";
const developmentUrl: string =
  Platform.OS === "ios" ? "http://192.168.86.21:8080" : "http://10.0.2.2:8080";

export const baseURL =
  process.env.NODE_ENV === "production" ? backendUrl : developmentUrl;

export const API = axios.create({ baseURL });

API.interceptors.request.use(async (config) => {
  try {
    config.headers["Authorisation"] = await EncryptedStorage.getItem("token");
  } catch (error) {}
  return config;
});
