import AppRouter from './routers/AppRouter'
import { Toast } from './components/common/Toast'
import { useToastStore } from './store/toastStore'

function App() {
  const { hideToast, isVisible, message, variant, position } = useToastStore()

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