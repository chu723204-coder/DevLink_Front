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
      {/* ✅ 최소 높이 설정으로 푸터 공백 해결 */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <AppRouter />
        </div>
      </div>
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