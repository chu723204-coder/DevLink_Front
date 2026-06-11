import api from "./api";

export interface NotificationResponseDto {
  notificationId: number;
  type: string;
  message: string;
  isRead: boolean;
  targetUrl: string;
  createdAt: string;
}

const BASE_URL = "/api/notifications";

const notificationService = {
  // 1. SSE 구독 (알림 실시간 수신)
  subscribe: (onMessage: (data: NotificationResponseDto) => void): EventSource => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
    const token = localStorage.getItem("accessToken") // SSE는 헤더 못 보내서 임시
    const eventSource = new EventSource(`${baseURL}${BASE_URL}/subscribe`, { withCredentials: true })
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch {}
    }
    return eventSource
  },

  // 2. 알림 목록 조회
  getNotifications: async (): Promise<NotificationResponseDto[]> => {
    const response = await api.get(BASE_URL)
    const payload = response.data?.data ?? response.data
    return Array.isArray(payload) ? payload : []
  },

  // 3. 단건 읽음 처리
  readNotification: async (notificationId: number): Promise<void> => {
    await api.patch(`${BASE_URL}/${notificationId}/read`)
  },

  // 4. 전체 읽음 처리
  readAllNotifications: async (): Promise<void> => {
    await api.patch(`${BASE_URL}/read-all`)
  },

  // 5. 읽지 않은 알림 수 조회
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get(`${BASE_URL}/unread-count`)
    const payload = response.data?.data ?? response.data
    return typeof payload === "number" ? payload : 0
  },
}

export default notificationService