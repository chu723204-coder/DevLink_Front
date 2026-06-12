import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

const categories = [
  { label: '전체', value: '' },
  { label: '자유', value: 'FREE' },
  { label: '면접후기', value: 'INTERVIEW' },
  { label: '기술질문', value: 'TECH' },
  { label: '취업정보', value: 'JOB' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuthStore()

  const currentCategory = new URLSearchParams(location.search).get('category') || ''

  return (
    <aside style={{
      width: '200px',
      flexShrink: 0,
      position: 'sticky',
      top: '72px',
      height: 'fit-content'
    }}>
      {/* 게시판 카테고리 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>
          게시판
        </div>
        {categories.map(cat => (
          <div
            key={cat.value}
            onClick={() => navigate(cat.value ? `/posts?category=${cat.value}` : '/posts')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: currentCategory === cat.value ? 600 : 400,
              color: currentCategory === cat.value ? '#4338CA' : '#374151',
              background: currentCategory === cat.value ? '#EEF2FF' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              if (currentCategory !== cat.value) {
                e.currentTarget.style.background = '#F3F4F6'
              }
            }}
            onMouseLeave={e => {
              if (currentCategory !== cat.value) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {cat.label}
          </div>
        ))}
      </div>

      {/* 스터디 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>
          스터디
        </div>
        <div
          onClick={() => navigate('/studies')}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          스터디 모집
        </div>
      </div>

      {/* 로그인 후 메뉴 */}
      {isLoggedIn && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>
            내 활동
          </div>
          {[
            { label: '내 게시글', path: '/mypage/posts' },
            { label: '내 스터디', path: '/mypage/studies' },
            { label: '알림', path: '/notifications' },
          ].map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}

export default Sidebar