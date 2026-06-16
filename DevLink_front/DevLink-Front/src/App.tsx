import { useEffect } from 'react'
import AppRouter from './routers/AppRouter'
import { Toast } from './components/common/Toast'
import { useToastStore } from './store/toastStore'
import { useAuthStore } from './store/useAuthStore'
import { connectSSE, disconnectSSE } from './service/sseService'

function App() {
  const { hideToast, isVisible, message, variant, position } = useToastStore()
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    if (isLoggedIn) {
      connectSSE()
    } else {
      disconnectSSE()
    }
    return () => {
      disconnectSSE()
    }
  }, [isLoggedIn])

  return (
    <>
      <AppRouter />
      <Toast
        variant={variant}
        position={position}
        isVisible={isVisible}
        onClose={hideToast}
      >
        {message}
      </Toast>
    </>
  )
}

export default App