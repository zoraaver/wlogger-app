import axios from "axios";

const backendUrl: string = "https://wlogger.uk/api";
const developmentUrl: string = "http://localhost:8080";

export const baseURL =
  process.env.NODE_ENV === "production" ? backendUrl : developmentUrl;

export const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});
