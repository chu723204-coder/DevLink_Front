import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
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

// ===== 알림 API =====
export const fetchNotifications = () =>
  api.get('/api/notifications')

export const markNotificationRead = (id: number) =>
  api.patch(`/api/notifications/${id}/read`)

export const markAllNotificationsRead = () =>
  api.patch('/api/notifications/read-all')

export default api;