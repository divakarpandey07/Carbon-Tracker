import axios from "axios";

export const LIVE_BACKEND_URL = "https://carbontracker-jr2i.onrender.com/api";

export const getApiBaseURL = () => {
  let envVal = (process.env.REACT_APP_API_URL || "").trim();

  // If env points to the broken / non-existent carbontracker-backend, redirect to carbontracker-jr2i
  if (envVal.includes("carbontracker-backend") || envVal.includes("carbon-tracker-1219")) {
    return LIVE_BACKEND_URL;
  }

  // If running in browser and NOT localhost (e.g. on Vercel), always use production backend unless a valid custom URL is given
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    if (!envVal || envVal.includes("localhost") || !/^https?:\/\//i.test(envVal)) {
      return LIVE_BACKEND_URL;
    }
  }

  if (envVal && /^https?:\/\//i.test(envVal)) {
    return envVal.replace(/\/+$/, "");
  }

  return LIVE_BACKEND_URL;
};

const baseURL = getApiBaseURL();

const api = axios.create({
  baseURL,
  timeout: 20000,
});

// Attach token automatically to every request and normalize URLs
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.warn("Could not read auth user from storage", error);
  }

  const activeBase = getApiBaseURL();
  config.baseURL = activeBase;

  if (config.url) {
    // Correct broken backend hosts dynamically
    if (config.url.includes("carbontracker-backend.onrender.com")) {
      config.url = config.url.replace("https://carbontracker-backend.onrender.com/api", activeBase);
    } else if (!/^https?:\/\//i.test(config.url)) {
      const cleanPath = config.url.replace(/^\/+/, "");
      config.url = `${activeBase}/${cleanPath}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Request Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    return Promise.reject(error);
  }
);

export default api;