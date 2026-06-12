import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import api from '../service/api'

const OAuth2RedirectPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')

    if (!accessToken) {
      navigate('/')
      return
    }

    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        const { userId, email, nickname, role } = res.data.data
        login(userId, email, nickname, role, accessToken)
        navigate('/')
      } catch {
        navigate('/')
      }
    }

    fetchUserInfo()
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '16px',
      color: '#4338CA'
    }}>
      로그인 처리 중...
    </div>
  )
}

export default OAuth2RedirectPage