import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "../service/api";

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  email: string | null;
  nickname: string | null;
  role: string | null;
  accessToken: string | null;
  activeModal: string;

  login: (userId: number, email: string, nickname: string, role: string, token: string) => void;
  logout: () => void;
  setAccessToken: (token: string | null) => void;
  setActiveModal: (state: string) => void;
  closeModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userId: null,
      email: null,
      nickname: null,
      role: null,
      accessToken: null, // 메모리에만 저장
      activeModal: "NONE",

      login: (userId, email, nickname, role, token) => {
        set({
          isLoggedIn: true,
          userId,
          email,
          nickname,
          role,
          accessToken: token
        });
      },

      logout: async () => {
        try {
          await api.post("/api/auth/logout");
        } catch {
          // 백엔드 실패해도 로컬 상태 초기화
        } finally {
          set({
            isLoggedIn: false,
            userId: null,
            email: null,
            nickname: null,
            role: null,
            accessToken: null,
            activeModal: "NONE"
          });
        }
      },

      setAccessToken: (token: string | null) => {
        set({ accessToken: token });
      },

      setActiveModal: (state: string) => {
        set({ activeModal: state });
      },

      closeModal: () => {
        set({ activeModal: "NONE" });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      // accessToken은 persist 제외 (보안)
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
        email: state.email,
        nickname: state.nickname,
        role: state.role,
      }),
    }
  )
);