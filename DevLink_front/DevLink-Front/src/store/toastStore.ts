import { create } from 'zustand'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'
type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'

interface ToastState {
  isVisible: boolean
  message: string
  variant: ToastVariant
  position: ToastPosition
  showToast: (message: string, variant?: ToastVariant, position?: ToastPosition) => void
  hideToast: () => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  isVisible: false,
  message: '',
  variant: 'info',
  position: 'bottom-center',

  showToast: (message, variant = 'info', position = 'bottom-center') => {
    set({ isVisible: true, message, variant, position })
    setTimeout(() => set({ isVisible: false }), 3000)
  },
  hideToast: () => set({ isVisible: false }),
  success: (message) => {
    set({ isVisible: true, message, variant: 'success', position: 'bottom-center' })
    setTimeout(() => set({ isVisible: false }), 3000)
  },
  error: (message) => {
    set({ isVisible: true, message, variant: 'error', position: 'bottom-center' })
    setTimeout(() => set({ isVisible: false }), 3000)
  },
  info: (message) => {
    set({ isVisible: true, message, variant: 'info', position: 'bottom-center' })
    setTimeout(() => set({ isVisible: false }), 3000)
  },
  warning: (message) => {
    set({ isVisible: true, message, variant: 'warning', position: 'bottom-center' })
    setTimeout(() => set({ isVisible: false }), 3000)
  },
}))