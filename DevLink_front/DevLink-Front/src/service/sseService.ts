import { useNotificationStore } from '../store/notificationStore'
import { useAuthStore } from '../store/useAuthStore'

let eventSource: EventSource | null = null

export const connectSSE = () => {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken || eventSource) return

  eventSource = new EventSource(
    `http://localhost:8080/api/notifications/subscribe`,
    { withCredentials: true }
  )

  eventSource.addEventListener('notification', (e) => {
    const { increaseUnread } = useNotificationStore.getState()
    increaseUnread()
  })

  eventSource.onerror = () => {
    disconnectSSE()
  }
}

export const disconnectSSE = () => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}