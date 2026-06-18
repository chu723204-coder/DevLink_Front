import { useState, useEffect } from 'react'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

interface User {
  userId: number
  email: string
  nickname: string
  role: string
  provider: string | null
  banned: boolean
  createdAt: string
}

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error } = useToastStore()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/users')
      setUsers(res.data.data || [])
    } catch (e) {
      console.error('회원 목록 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBan = async (userId: number, banned: boolean) => {
    const msg = banned ? '정지를 해제하시겠습니까?' : '이 회원을 정지하시겠습니까?'
    if (!window.confirm(msg)) return
    try {
      await api.patch(`/api/admin/users/${userId}/status`)
      setUsers(prev => prev.map(u => u.userId === userId ? { ...u, banned: !u.banned } : u))
      success(banned ? '계정 정지가 해제되었습니다.' : '계정이 정지되었습니다.')
    } catch (e) {
      console.error('정지/해제 실패', e)
      error('처리에 실패했습니다.')
    }
  }

  const handleDeleteUser = async (userId: number, nickname: string) => {
    if (!window.confirm(`[${nickname}] 회원을 강제 탈퇴시키겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return
    try {
      await api.delete(`/api/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u.userId !== userId))
      success(`[${nickname}] 회원이 강제 탈퇴되었습니다.`)
    } catch (e) {
      console.error('강제 탈퇴 실패', e)
      error('처리에 실패했습니다.')
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('ko-KR')

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>
            👥 회원 관리
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '6px 0 0 0' }}>
            총 {users.length}명
          </p>
        </div>
      </div>

      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 1fr 80px 80px 100px 160px',
          padding: '12px 20px', background: '#F9FAFB',
          borderBottom: '1px solid #F3F4F6',
          fontSize: '12px', fontWeight: 600, color: '#6B7280'
        }}>
          <div>ID</div>
          <div>닉네임</div>
          <div>이메일</div>
          <div>권한</div>
          <div>가입방법</div>
          <div>상태</div>
          <div>관리</div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
            불러오는 중...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
            회원이 없습니다
          </div>
        ) : (
          users.map((user, idx) => (
            <div
              key={user.userId}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 1fr 80px 80px 100px 160px',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: idx < users.length - 1 ? '1px solid #F9FAFB' : 'none',
                background: user.banned ? '#FFF5F5' : '#fff',
                transition: 'background 0.15s'
              }}
            >
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{user.userId}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                {user.nickname}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
              <div>
                <span style={{
                  padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                  background: user.role === 'ROLE_ADMIN' ? '#EEF2FF' : '#F3F4F6',
                  color: user.role === 'ROLE_ADMIN' ? '#4338CA' : '#6B7280'
                }}>
                  {user.role === 'ROLE_ADMIN' ? '관리자' : '일반'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                {user.provider || '일반'}
              </div>
              <div>
                <span style={{
                  padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                  background: user.banned ? '#FEF2F2' : '#ECFDF5',
                  color: user.banned ? '#DC2626' : '#059669'
                }}>
                  {user.banned ? '정지' : '정상'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {user.role !== 'ROLE_ADMIN' && (
                  <>
                    <button
                      onClick={() => handleToggleBan(user.userId, user.banned)}
                      style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        background: user.banned ? '#ECFDF5' : '#FEF9C3',
                        color: user.banned ? '#059669' : '#92400E',
                        border: user.banned ? '1px solid #A7F3D0' : '1px solid #FDE68A'
                      }}
                    >
                      {user.banned ? '해제' : '정지'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.userId, user.nickname)}
                      style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        background: '#FEF2F2', color: '#DC2626',
                        border: '1px solid #FECACA'
                      }}
                    >
                      탈퇴
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminUsersPage