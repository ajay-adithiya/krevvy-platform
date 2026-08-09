import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

import { useAuthStore } from "@/store/auth.store";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

function processQueue(
  error: unknown,
  token: string | null = null,
) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("accessToken");

    if (token) {
      config.headers.set(
        "Authorization",
        `Bearer ${token}`,
      );
    }

    return config;
  },
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((token) => {
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${token}`,
        );

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      processQueue(error, null);

      useAuthStore.getState().logout();

      Cookies.remove("accessToken", {
        path: "/",
      });

      Cookies.remove("refreshToken", {
        path: "/",
      });

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      isRefreshing = false;

      return Promise.reject(error);
    }

    try {
      const refreshResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          refreshToken,
        },
      );

      const newAccessToken =
        refreshResponse.data.data.accessToken;

      const newRefreshToken =
        refreshResponse.data.data.refreshToken;

      Cookies.set(
        "accessToken",
        newAccessToken,
        {
          expires: 7,
          sameSite: "lax",
          path: "/",
        },
      );

      Cookies.set(
        "refreshToken",
        newRefreshToken,
        {
          expires: 7,
          sameSite: "lax",
          path: "/",
        },
      );

      useAuthStore
        .getState()
        .setAccessToken(newAccessToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.set(
        "Authorization",
        `Bearer ${newAccessToken}`,
      );

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      useAuthStore.getState().logout();

      Cookies.remove("accessToken", {
        path: "/",
      });

      Cookies.remove("refreshToken", {
        path: "/",
      });

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;