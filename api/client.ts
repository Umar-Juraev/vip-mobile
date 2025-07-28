// api/client.ts
import { removeLocalUserInfo } from "@/utils/storage";
import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "expo-router";
import { isEmpty, trim } from "lodash";

// Use environment variables for API URL
const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://your-api-url.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This will work for cookie-based auth
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (
      config.params?.s &&
      (config.method === "get" || config.method === "GET")
    ) {
      config.params.s = JSON.stringify(omitEmptyProperties(config.params.s));
    }

    if (
      config.params?.sort &&
      (config.method === "get" || config.method === "GET")
    ) {
      config.params.sort = JSON.stringify(
        omitEmptyProperties(config.params.sort)
      );
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {

    if (error.response && error.response.status === 401) {
      await removeLocalUserInfo();
      router.push("/(tabs)/login");
    }

    return Promise.reject(error.response?.data);
  }
);

function omitEmptyProperties(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(omitEmptyProperties).filter((item) => !isEmpty(item));
  }

  const res: any = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === "object") {
      const newValue = omitEmptyProperties(value);
      if (!isEmpty(newValue)) {
        res[key] = newValue;
      }
    } else if (value !== null && trim(value) !== "") {
      res[key] = trim(value);
    }
  });

  return res;
}

export default api;
