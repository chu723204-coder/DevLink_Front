import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const OAuth2RedirectPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')

    if (accessToken) {
      // TODO: 토큰으로 유저 정보 조회 후 login() 호출 예정
      navigate('/')
    } else {
      navigate('/')
    }
  }, [])

  return <div>로그인 처리 중...</div>
}

export default OAuth2RedirectPage