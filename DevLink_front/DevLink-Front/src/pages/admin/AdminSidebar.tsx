import { useNavigate, useLocation } from 'react-router-dom'

const menus = [
  { path: '/admin', label: '📊 대시보드', exact: true },
  { path: '/admin/users', label: '👥 회원 관리' },
  { path: '/admin/posts', label: '📝 게시글 관리' },
  { path: '/admin/studies', label: '📚 스터디 관리' },
]

function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div style={{
      width: '220px', minHeight: '100%', background: '#1E1B4B',
      display: 'flex', flexDirection: 'column', flexShrink: 0
    }}>
      {/* 로고 */}
      <div style={{
        padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
          DevLink
        </div>
        <div style={{ fontSize: '11px', color: '#A5B4FC', marginTop: '2px' }}>
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
              background: isActive(menu.path, menu.exact) ? 'rgba(165,180,252,0.15)' : 'transparent',
              color: isActive(menu.path, menu.exact) ? '#A5B4FC' : '#94A3B8',
              marginBottom: '2px', transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              if (!isActive(menu.path, menu.exact)) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = '#CBD5E1'
              }
            }}
            onMouseLeave={e => {
              if (!isActive(menu.path, menu.exact)) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#94A3B8'
              }
            }}
          >
            {menu.label}
          </button>
        ))}
      </nav>

      {/* 하단 - 사이트로 돌아가기 */}
      <div style={{ padding: '16px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            textAlign: 'left', fontSize: '12px', fontWeight: 500,
            background: 'transparent', color: '#64748B', transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.color = '#94A3B8'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#64748B'
          }}
        >
          ← 사이트로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar