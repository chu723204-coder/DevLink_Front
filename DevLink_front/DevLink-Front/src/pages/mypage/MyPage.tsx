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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)
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
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return alert('모든 비밀번호 항목을 입력해주세요.')
    }
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }
    setPasswordMismatch(false)
    setLoading(true)
    try {
      await api.patch('/api/users/me/password', null, { params: { currentPassword, newPassword } })
      showToast('비밀번호가 수정되었습니다.', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
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
      await api.delete('/api/users/me')
      await logout()
      showToast('회원 탈퇴가 완료되었습니다.', 'success')
      navigate('/')
    } catch (e) {
      showToast('회원 탈퇴에 실패했습니다.', 'error')
    }
  }

  const isSocialUser = userInfo?.provider && userInfo.provider !== 'local'
  const avatarColor = { bg: '#EEF2FF', color: '#4338CA' }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px' }}>

      {/* ✅ 프로필 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
        borderRadius: '16px', padding: '28px 32px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '20px',
        boxShadow: '0 4px 16px rgba(67,56,202,0.3)'
      }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', color: '#fff',
          fontSize: '24px', fontWeight: 700, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid rgba(255,255,255,0.4)'
        }}>
          {userInfo?.nickname?.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            {userInfo?.nickname}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            {userInfo?.email}
          </div>
          {userInfo?.provider && userInfo.provider !== 'local' && (
            <div style={{
              marginTop: '6px', fontSize: '11px', fontWeight: 600,
              background: 'rgba(255,255,255,0.2)', color: '#fff',
              padding: '2px 10px', borderRadius: '20px', display: 'inline-block'
            }}>
              {userInfo.provider === 'kakao' ? '카카오' : '네이버'} 로그인
            </div>
          )}
        </div>
      </div>

      {/* ✅ 닉네임 수정 */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '1px solid #F3F4F6', padding: '24px', marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ✏️ 닉네임 수정
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="새 닉네임"
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '8px',
              border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
              transition: 'border-color 0.15s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
            onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          />
          <button
            onClick={handleNicknameUpdate}
            disabled={loading}
            style={{
              padding: '10px 18px', borderRadius: '8px', fontSize: '14px',
              background: '#4338CA', color: '#fff', border: 'none',
              cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
              boxShadow: '0 1px 3px rgba(67,56,202,0.3)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
            onMouseLeave={e => e.currentTarget.style.background = '#4338CA'}
          >
            수정
          </button>
        </div>
      </div>

      {/* ✅ 비밀번호 수정 */}
      {!isSocialUser && (
        <div style={{
          background: '#fff', borderRadius: '12px',
          border: '1px solid #F3F4F6', padding: '24px', marginBottom: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
            🔒 비밀번호 수정
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호"
              style={{
                padding: '10px 14px', borderRadius: '8px',
                border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.15s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
              onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
            />
            <input
              type="password"
              value={newPassword}
              onChange={e => { setNewPassword(e.target.value); setPasswordMismatch(false) }}
              placeholder="새 비밀번호"
              style={{
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none',
                border: `1px solid ${passwordMismatch ? '#DC2626' : '#E5E7EB'}`,
                transition: 'border-color 0.15s'
              }}
              onFocus={e => { if (!passwordMismatch) e.currentTarget.style.borderColor = '#4338CA' }}
              onBlur={e => { if (!passwordMismatch) e.currentTarget.style.borderColor = '#E5E7EB' }}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setPasswordMismatch(false) }}
              placeholder="새 비밀번호 확인"
              style={{
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none',
                border: `1px solid ${passwordMismatch ? '#DC2626' : '#E5E7EB'}`,
                transition: 'border-color 0.15s'
              }}
              onFocus={e => { if (!passwordMismatch) e.currentTarget.style.borderColor = '#4338CA' }}
              onBlur={e => { if (!passwordMismatch) e.currentTarget.style.borderColor = '#E5E7EB' }}
            />
            {passwordMismatch && (
              <p style={{ fontSize: '13px', color: '#DC2626', margin: '0' }}>
                새 비밀번호가 일치하지 않습니다.
              </p>
            )}
            <button
              onClick={handlePasswordUpdate}
              disabled={loading}
              style={{
                padding: '10px', borderRadius: '8px', fontSize: '14px',
                background: loading ? '#A5B4FC' : '#4338CA',
                color: '#fff', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 600, transition: 'all 0.15s',
                boxShadow: loading ? 'none' : '0 1px 3px rgba(67,56,202,0.3)'
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3730A3' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4338CA' }}
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      )}

      {/* ✅ 내 활동 */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '1px solid #F3F4F6', padding: '24px', marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
          📋 내 활동
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('/mypage/posts')}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px',
              background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE',
              cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}
          >
            📝 내 게시글
          </button>
          <button
            onClick={() => navigate('/mypage/studies')}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px',
              background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE',
              cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}
          >
            📚 내 스터디
          </button>
        </div>
      </div>

      {/* ✅ 회원 탈퇴 */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '1px solid #F3F4F6', padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
          🚪 회원 탈퇴
        </h2>
        <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
          탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
        </p>
        <button
          onClick={handleDeleteUser}
          style={{
            padding: '10px 20px', borderRadius: '8px', fontSize: '14px',
            background: '#FEF2F2', color: '#DC2626',
            border: '1px solid #FECACA', cursor: 'pointer', fontWeight: 600,
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
          onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  )
}

export default MyPage