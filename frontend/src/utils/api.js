import axios from "axios";

const fallbackBaseURL = "http://localhost:5000/api";

const normalizeBaseURL = (value) => {
  if (typeof value !== "string") return fallbackBaseURL;

  const trimmed = value.trim();
  if (!trimmed) return fallbackBaseURL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/+$/, "");
  if (trimmed.startsWith("/")) return `http://localhost:5000${trimmed.replace(/\/+$/, "")}`;

  return `http://${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const buildAbsoluteURL = (baseURLValue, urlValue) => {
  if (typeof urlValue !== "string") return baseURLValue;

  const trimmedUrl = urlValue.trim();
  if (!trimmedUrl) return baseURLValue;
  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;

  const normalizedBase = normalizeBaseURL(baseURLValue);
  const normalizedPath = trimmedUrl.replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
};

const baseURL = normalizeBaseURL(process.env.REACT_APP_API_URL || fallbackBaseURL);

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.warn("Could not read auth user from storage", error);
  }

  config.baseURL = normalizeBaseURL(config.baseURL || baseURL);

  if (config.url) {
    config.url = buildAbsoluteURL(config.baseURL, config.url);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.message === "Invalid URL") {
      console.error("Invalid URL request detected", error.config?.url, error.config?.baseURL);
    }
    return Promise.reject(error);
  }
);

export default api;