import { create } from "zustand";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../service/api";

export interface Notification {
  id: number;
  type: string;
  message: string;       // ← content → message 로 변경
  isRead: boolean;
  targetUrl: string;
  createdAt: string;
}

interface NotificationState {
  unreadCount: number;
  notifications: Notification[];
  setUnreadCount: (count: number) => void;
  increaseUnread: () => void;
  resetUnread: () => void;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  notifications: [],
  setUnreadCount: (count) => set({ unreadCount: count }),
  increaseUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnread: () => set({ unreadCount: 0 }),

  loadNotifications: async () => {
    try {
      const res = await fetchNotifications()
      const list: Notification[] = res.data.data ?? []
      const unread = list.filter(n => !n.isRead).length
      set({ notifications: list, unreadCount: unread })
    } catch {
      // 실패 시 무시
    }
  },

  markAsRead: async (id: number) => {
    try {
      await markNotificationRead(id)
      set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }))
    } catch {
      // 실패 시 무시
    }
  },

  markAllAsRead: async () => {
    try {
      await markAllNotificationsRead()
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      }))
    } catch {
      // 실패 시 무시
    }
  },
}));