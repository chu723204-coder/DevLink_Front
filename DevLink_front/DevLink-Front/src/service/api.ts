import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Refresh Token 쿠키 전송
});

// 요청 인터셉터 — Zustand에서 Access Token 읽어서 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 — 401 시 토큰 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh Token (HttpOnly Cookie) 으로 새 Access Token 발급
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/auth/reissue`,
          {},
          { withCredentials: true }
        );
        const newToken = res.data.data;
        useAuthStore.getState().setAccessToken(newToken);

        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;