import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useToastStore } from '../../store/toastStore'

const menus = [
  { path: '/admin', label: '📊 대시보드', exact: true },
  { path: '/admin/users', label: '👥 회원 관리' },
  { path: '/admin/posts', label: '📝 게시글 관리' },
  { path: '/admin/studies', label: '📚 스터디 관리' },
  { path: '/admin/reports', label: '🚩 신고 관리' },
]

function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthStore()
  const { success } = useToastStore()

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    success('로그아웃되었습니다.')
    navigate('/')
  }

  return (
    <div style={{
      width: '220px', minHeight: '100%', background: '#EEF2FF',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      borderRight: '1px solid #C7D2FE'
    }}>
      {/* 로고 */}
      <div style={{
        padding: '24px 20px', borderBottom: '1px solid #C7D2FE'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#3730A3', letterSpacing: '-0.3px' }}>
          DevLink
        </div>
        <div style={{ fontSize: '11px', color: '#6366F1', marginTop: '2px' }}>
          관리자 페이지
        </div>
      </div>

      {/* 메뉴 */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {menus.map(menu => (
          <button
            key={menu.path}
            onClick={() => navigate(menu.path)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              fontSize: '13px', fontWeight: isActive(menu.path, menu.exact) ? 700 : 500,
              background: isActive(menu.path, menu.exact) ? '#4338CA' : 'transparent',
              color: isActive(menu.path, menu.exact) ? '#fff' : '#4338CA',
              marginBottom: '2px', transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              if (!isActive(menu.path, menu.exact)) {
                e.currentTarget.style.background = '#E0E7FF'
                e.currentTarget.style.color = '#3730A3'
              }
            }}
            onMouseLeave={e => {
              if (!isActive(menu.path, menu.exact)) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#4338CA'
              }
            }}
          >
            {menu.label}
          </button>
        ))}
      </nav>

      {/* 하단 버튼들 */}
      <div style={{ padding: '16px 10px', borderTop: '1px solid #C7D2FE', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '8px',
            border: '1px solid #C7D2FE', cursor: 'pointer',
            textAlign: 'left', fontSize: '12px', fontWeight: 500,
            background: 'transparent', color: '#6366F1', transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#E0E7FF'
            e.currentTarget.style.color = '#3730A3'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#6366F1'
          }}
        >
          ← 사이트로 돌아가기
        </button>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '8px',
            border: '1px solid #FECACA', cursor: 'pointer',
            textAlign: 'left', fontSize: '12px', fontWeight: 500,
            background: 'transparent', color: '#EF4444', transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#FEF2F2'
            e.currentTarget.style.color = '#DC2626'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#EF4444'
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar