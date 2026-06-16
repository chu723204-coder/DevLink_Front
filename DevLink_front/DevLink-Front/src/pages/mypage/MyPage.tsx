import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useToastStore } from '../../store/toastStore'
import api from '../../service/api'

interface UserInfo {
  userId: number
  email: string
  nickname: string
  provider: string
}

function MyPage() {
  const navigate = useNavigate()
  const { nickname: storeNickname, login, logout, userId, email, role, accessToken } = useAuthStore()
  const { showToast } = useToastStore()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [nickname, setNickname] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/api/users/me')
        setUserInfo(res.data.data)
        setNickname(res.data.data.nickname)
      } catch (e) {
        console.error('내 정보 조회 실패', e)
      }
    }
    fetchUserInfo()
  }, [])

  const handleNicknameUpdate = async () => {
    if (!nickname.trim()) return alert('닉네임을 입력해주세요.')
    setLoading(true)
    try {
      const res = await api.patch('/api/users/me/nickname', null, { params: { nickname } })
      const updated = res.data.data
      login(userId!, updated.email, updated.nickname, role!, accessToken!)
      showToast('닉네임이 수정되었습니다.', 'success')
    } catch (e) {
      showToast('닉네임 수정에 실패했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) return alert('비밀번호를 입력해주세요.')
    setLoading(true)
    try {
      await api.patch('/api/users/me/password', null, { params: { currentPassword, newPassword } })
      showToast('비밀번호가 수정되었습니다.', 'success')
      setCurrentPassword('')
      setNewPassword('')
    } catch (e: any) {
      const msg = e.response?.data?.message || '비밀번호 수정에 실패했습니다.'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return
    try {
      await logout()
      await api.delete('/api/users/me')
      showToast('회원 탈퇴가 완료되었습니다.', 'success')
      navigate('/')
    } catch (e) {
      showToast('회원 탈퇴에 실패했습니다.', 'error')
    }
  }

  const isSocialUser = userInfo?.provider && userInfo.provider !== 'local'

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>마이페이지</h1>

      {/* 내 정보 */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>내 정보</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>이메일</label>
            <div style={{ fontSize: '14px', color: '#111827' }}>{userInfo?.email}</div>
          </div>
          {userInfo?.provider && userInfo.provider !== 'local' && (
            <div>
              <label style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>로그인 방식</label>
              <div style={{ fontSize: '14px', color: '#111827' }}>
                {userInfo.provider === 'kakao' ? '카카오' : '네이버'} 로그인
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 닉네임 수정 */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>닉네임 수정</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="새 닉네임"
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={handleNicknameUpdate}
            disabled={loading}
            style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '14px', background: '#4338CA', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            수정
          </button>
        </div>
      </div>

      {/* 비밀번호 수정 (소셜 로그인 사용자 제외) */}
      {!isSocialUser && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>비밀번호 수정</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호"
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }}
            />
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }}
            />
            <button
              onClick={handlePasswordUpdate}
              disabled={loading}
              style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', background: '#4338CA', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      )}

      {/* 내 활동 바로가기 */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>내 활동</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('/mypage/posts')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', background: '#EEF2FF', color: '#4338CA', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            내 게시글
          </button>
          <button
            onClick={() => navigate('/mypage/studies')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', background: '#EEF2FF', color: '#4338CA', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            내 스터디
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>회원 탈퇴</h2>
        <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
        <button
          onClick={handleDeleteUser}
          style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '14px', background: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  )
}

export default MyPage