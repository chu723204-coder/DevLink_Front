import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useToastStore } from '../../store/toastStore'
import { Bell, Shield, User, ChevronDown } from 'lucide-react'

const navItems = [
  { label: '게시판', path: '/posts' },
  { label: '스터디', path: '/studies' },
  { label: '채팅', path: '/chat' },
  { label: '공지사항', path: '/notices' },
]

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
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid #F3F4F6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '1600px', margin: '0 auto', padding: '0 60px',
          height: '60px', display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center'
        }}>

          {/* ✅ 왼쪽: 로고 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => navigate('/')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: 'pointer', textDecoration: 'none'
              }}
            >
              {/* ✅ 로고 아이콘 뱃지 */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(67,56,202,0.3)'
              }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 800 }}>D</span>
              </div>
              {/* ✅ 로고 텍스트 통일 */}
              <span style={{
                fontSize: '17px', fontWeight: 700,
                color: '#111827', letterSpacing: '-0.5px'
              }}>
                Dev<span style={{ color: '#4338CA' }}>Link</span>
              </span>
            </div>
          </div>

          {/* ✅ 중앙: 네비 메뉴 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {navItems.map(item => {
              const isActive = location.pathname.startsWith(item.path)
              return (
                <span
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    color: isActive ? '#4338CA' : '#6B7280',
                    position: 'relative',
                    transition: 'all 0.15s',
                    borderRadius: '8px',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#4338CA'
                      e.currentTarget.style.background = '#F5F3FF'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#6B7280'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {item.label}
                  {/* ✅ 활성 메뉴 하단 인디고 언더라인 */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', bottom: '-1px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px', height: '2px',
                      background: '#4338CA', borderRadius: '2px'
                    }} />
                  )}
                </span>
              )
            })}
          </div>

          {/* ✅ 오른쪽: 버튼들 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            {isLoggedIn ? (
              <>
                {/* 관리자 버튼 */}
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    style={{
                      width: '36px', height: '36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '8px', background: 'transparent',
                      border: '1px solid #F3F4F6', cursor: 'pointer', color: '#6B7280',
                      transition: 'all 0.15s'
                    }}
                    title="관리자"
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#F5F3FF'
                      e.currentTarget.style.color = '#4338CA'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#6B7280'
                    }}
                  >
                    <Shield size={17} strokeWidth={1.5} />
                  </button>
                )}

                {/* ✅ 알림 버튼 */}
                <div ref={notiRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setNotiOpen(prev => !prev)}
                    style={{
                      width: '36px', height: '36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '8px', background: 'transparent',
                      border: '1px solid #F3F4F6', cursor: 'pointer',
                      color: notiOpen ? '#4338CA' : '#6B7280',
                      position: 'relative', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#F5F3FF'
                      e.currentTarget.style.color = '#4338CA'
                      e.currentTarget.style.borderColor = '#C7D2FE'
                    }}
                    onMouseLeave={e => {
                      if (!notiOpen) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#6B7280'
                        e.currentTarget.style.borderColor = '#F3F4F6'
                      }
                    }}
                  >
                    <Bell size={17} strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute', top: '7px', right: '7px',
                        width: '7px', height: '7px',
                        background: '#EF4444', borderRadius: '50%',
                        border: '1.5px solid #fff'
                      }} />
                    )}
                  </button>
                  {notiOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      width: '320px', background: '#fff',
                      border: '1px solid #F3F4F6', borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200
                    }}>
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        알림
                      </div>
                      <div style={{ padding: '24px 16px', fontSize: '13px', color: '#9CA3AF', textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔔</div>
                        새로운 알림이 없어요
                      </div>
                      <div
                        onClick={() => { navigate('/notifications'); setNotiOpen(false) }}
                        style={{
                          padding: '12px 16px', borderTop: '1px solid #F3F4F6',
                          fontSize: '12px', color: '#4338CA', textAlign: 'center',
                          cursor: 'pointer', fontWeight: 500
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5F3FF'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        알림 전체보기
                      </div>
                    </div>
                  )}
                </div>

                {/* ✅ 프로필 드롭다운 */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: dropdownOpen ? '#F5F3FF' : 'transparent',
                      border: `1px solid ${dropdownOpen ? '#C7D2FE' : '#F3F4F6'}`,
                      borderRadius: '20px', padding: '4px 10px 4px 4px',
                      cursor: 'pointer', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#F5F3FF'
                      e.currentTarget.style.borderColor = '#C7D2FE'
                    }}
                    onMouseLeave={e => {
                      if (!dropdownOpen) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = '#F3F4F6'
                      }
                    }}
                  >
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: '#EEF2FF', color: '#4338CA',
                      fontSize: '11px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {nickname?.charAt(0) || <User size={12} />}
                    </div>
                    <span style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>{nickname}</span>
                    <ChevronDown size={13} strokeWidth={2} color="#9CA3AF"
                      style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    />
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      width: '200px', background: '#fff',
                      border: '1px solid #F3F4F6', borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden'
                    }}>
                      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #F3F4F6' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{nickname}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>일반 회원</div>
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
                            style={{
                              padding: '10px 16px', fontSize: '13px',
                              color: '#111827', cursor: 'pointer', transition: 'background 0.1s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            {item.label}
                          </div>
                        ))}
                        <div style={{ borderTop: '1px solid #F3F4F6' }}>
                          <div
                            onClick={handleLogout}
                            style={{
                              padding: '10px 16px', fontSize: '13px',
                              color: '#EF4444', cursor: 'pointer', transition: 'background 0.1s'
                            }}
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
                  style={{
                    fontSize: '13px', fontWeight: 500, color: '#6B7280',
                    border: '1px solid #E5E7EB', borderRadius: '8px',
                    padding: '7px 16px', background: 'transparent', cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#C7D2FE'
                    e.currentTarget.style.color = '#4338CA'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E5E7EB'
                    e.currentTarget.style.color = '#6B7280'
                  }}
                >
                  로그인
                </button>
                <button
                  onClick={() => setActiveModal('JOIN')}
                  style={{
                    fontSize: '13px', fontWeight: 600, color: '#fff',
                    background: '#4338CA', border: 'none',
                    borderRadius: '8px', padding: '7px 16px', cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(67,56,202,0.3)',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
                  onMouseLeave={e => e.currentTarget.style.background = '#4338CA'}
                >
                  회원가입
                </button>
              </>
            )}

            {/* 모바일 햄버거 버튼 */}
            <button
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
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 110, opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none', transition: 'opacity 0.3s'
        }}
      />

      {/* 모바일 사이드바 */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%',
        width: 'min(75vw, 280px)', background: '#fff', zIndex: 120,
        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: mobileMenuOpen ? '-4px 0 24px rgba(0,0,0,0.12)' : 'none',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{
          height: '60px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 24px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>D</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
              Dev<span style={{ color: '#4338CA' }}>Link</span>
            </span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#111' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {navItems.map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: '16px 24px', borderBottom: '1px solid #F9FAFB',
                cursor: 'pointer', fontSize: '14px', color: '#111827',
                display: 'flex', justifyContent: 'space-between'
              }}
            >
              {item.label} <span style={{ color: '#ccc', fontSize: '10px' }}>→</span>
            </div>
          ))}

          {isLoggedIn ? (
            <>
              <div
                onClick={() => navigate('/mypage')}
                style={{ padding: '16px 24px', borderBottom: '1px solid #F9FAFB', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}
              >
                마이페이지 <span style={{ color: '#ccc', fontSize: '10px' }}>→</span>
              </div>
              <div
                onClick={() => navigate('/notifications')}
                style={{ padding: '16px 24px', borderBottom: '1px solid #F9FAFB', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}
              >
                알림 {unreadCount > 0 && <span style={{ background: '#EF4444', color: '#fff', borderRadius: '10px', fontSize: '11px', padding: '0 6px' }}>{unreadCount}</span>}
              </div>
              {isAdmin && (
                <div
                  onClick={() => navigate('/admin')}
                  style={{ padding: '16px 24px', borderBottom: '1px solid #F9FAFB', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}
                >
                  관리자 <span style={{ color: '#ccc', fontSize: '10px' }}>→</span>
                </div>
              )}
              <div onClick={handleLogout} style={{ padding: '16px 24px', cursor: 'pointer', fontSize: '14px', color: '#EF4444' }}>
                로그아웃
              </div>
            </>
          ) : (
            <>
              <div
                onClick={() => { setActiveModal('LOGIN'); setMobileMenuOpen(false) }}
                style={{ padding: '16px 24px', borderBottom: '1px solid #F9FAFB', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'flex', justifyContent: 'space-between' }}
              >
                로그인 <span style={{ color: '#ccc', fontSize: '10px' }}>→</span>
              </div>
              <div
                onClick={() => { setActiveModal('JOIN'); setMobileMenuOpen(false) }}
                style={{ padding: '16px 24px', cursor: 'pointer', fontSize: '14px', color: '#4338CA', fontWeight: 500 }}
              >
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