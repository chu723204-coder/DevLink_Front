import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useToastStore } from '../../store/toastStore'
import { Bell, Shield, User } from 'lucide-react'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, logout, setActiveModal, role, nickname } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const { success } = useToastStore()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notiOpen, setNotiOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const notiRef = useRef<HTMLDivElement>(null)

  const isAdmin = role === 'ROLE_ADMIN'

  const handleLogout = () => {
    logout()
    success('로그아웃되었습니다.')
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setNotiOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setDropdownOpen(false)
    setNotiOpen(false)
  }, [location.pathname])

  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', borderBottom: '0.5px solid rgba(0,0,0,0.14)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div
              onClick={() => navigate('/')}
              style={{ fontSize: '18px', fontWeight: 600, color: '#4338CA', letterSpacing: '-0.4px', cursor: 'pointer', flexShrink: 0 }}
            >
              Dev<span style={{ color: '#111827' }}>Link</span>
            </div>

            {/* 데스크탑 네비 메뉴 */}
            <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[
                { label: '게시판', path: '/posts' },
                { label: '스터디', path: '/studies' },
                { label: '채팅', path: '/chat' },
              ].map(item => (
                <span
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: 500,
                    cursor: 'pointer', color: location.pathname.startsWith(item.path) ? '#4338CA' : '#6B7280',
                    background: location.pathname.startsWith(item.path) ? '#EEF2FF' : 'transparent',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { if (!location.pathname.startsWith(item.path)) { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#4338CA' } }}
                  onMouseLeave={e => { if (!location.pathname.startsWith(item.path)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280' } }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* 데스크탑 우측 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isLoggedIn ? (
              <>
                {/* 관리자 버튼 */}
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: '#6B7280', display: 'flex', alignItems: 'center' }}
                    title="관리자"
                  >
                    <Shield size={18} strokeWidth={1.5} />
                  </button>
                )}

                {/* 알림 버튼 */}
                <div ref={notiRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setNotiOpen(prev => !prev)}
                    style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'transparent', border: '0.5px solid rgba(0,0,0,0.14)', cursor: 'pointer', color: '#6B7280', position: 'relative' }}
                  >
                    <Bell size={18} strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '1.5px solid #fff' }} />
                    )}
                  </button>
                  {notiOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '320px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200 }}>
                      <div style={{ padding: '16px', fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>알림이 없습니다</div>
                    </div>
                  )}
                </div>

                {/* 프로필 드롭다운 */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: '20px', padding: '4px 10px 4px 4px', cursor: 'pointer' }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#EEF2FF', color: '#4338CA', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {nickname?.charAt(0) || <User size={12} />}
                    </div>
                    <span style={{ fontSize: '13px', color: '#111827' }}>{nickname}</span>
                  </button>

                  {dropdownOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '200px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden' }}>
                      <div style={{ padding: '14px 16px 10px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{nickname}</div>
                      </div>
                      <div>
                        {[
                          { label: '내 프로필', path: '/mypage' },
                          { label: '내 게시글', path: '/mypage/posts' },
                          { label: '내 스터디', path: '/mypage/studies' },
                        ].map(item => (
                          <div
                            key={item.path}
                            onClick={() => { navigate(item.path); setDropdownOpen(false) }}
                            style={{ padding: '10px 16px', fontSize: '13px', color: '#111827', cursor: 'pointer', transition: 'background 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            {item.label}
                          </div>
                        ))}
                        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
                          <div
                            onClick={handleLogout}
                            style={{ padding: '10px 16px', fontSize: '13px', color: '#EF4444', cursor: 'pointer', transition: 'background 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            로그아웃
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveModal('LOGIN')}
                  style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: '8px', padding: '7px 16px', background: 'transparent', cursor: 'pointer' }}
                >
                  로그인
                </button>
                <button
                  onClick={() => setActiveModal('JOIN')}
                  style={{ fontSize: '13px', fontWeight: 500, color: '#fff', background: '#4338CA', border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer' }}
                >
                  회원가입
                </button>
              </>
            )}

            {/* 모바일 햄버거 버튼 */}
            <button
              className="flex md:hidden"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'none' }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* 모바일 딤 오버레이 */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 110, opacity: mobileMenuOpen ? 1 : 0, pointerEvents: mobileMenuOpen ? 'auto' : 'none', transition: 'opacity 0.3s' }}
      />

      {/* 모바일 사이드바 */}
      <div
        style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: 'min(75vw, 280px)', background: '#fff', zIndex: 120, transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)', boxShadow: mobileMenuOpen ? '-4px 0 24px rgba(0,0,0,0.12)' : 'none', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#4338CA' }}>Dev<span style={{ color: '#111827' }}>Link</span></span>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#111' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {[
            { label: '게시판', path: '/posts' },
            { label: '스터디', path: '/studies' },
            { label: '채팅', path: '/chat' },
          ].map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}
            >
              {item.label} <span style={{ color: '#ccc', fontSize: '10px' }}>→</span>
            </div>
          ))}

          {isLoggedIn ? (
            <>
              <div onClick={() => navigate('/mypage')} style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}>
                마이페이지 <span style={{ color: '#ccc', fontSize: '10px' }}>→</span>
              </div>
              <div onClick={() => navigate('/notifications')} style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}>
                알림 {unreadCount > 0 && <span style={{ background: '#EF4444', color: '#fff', borderRadius: '10px', fontSize: '11px', padding: '0 6px' }}>{unreadCount}</span>}
              </div>
              {isAdmin && (
                <div onClick={() => navigate('/admin')} style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}>
                  관리자 <span style={{ color: '#ccc', fontSize: '10px' }}>→</span>
                </div>
              )}
              <div onClick={handleLogout} style={{ padding: '16px 24px', cursor: 'pointer', fontSize: '14px', color: '#EF4444' }}>
                로그아웃
              </div>
            </>
          ) : (
            <>
              <div onClick={() => { setActiveModal('LOGIN'); setMobileMenuOpen(false) }} style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}>
                로그인 <span style={{ color: '#ccc', fontSize: '10px' }}>→</span>
              </div>
              <div onClick={() => { setActiveModal('JOIN'); setMobileMenuOpen(false) }} style={{ padding: '16px 24px', cursor: 'pointer', fontSize: '14px', color: '#4338CA', fontWeight: 500 }}>
                회원가입
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar