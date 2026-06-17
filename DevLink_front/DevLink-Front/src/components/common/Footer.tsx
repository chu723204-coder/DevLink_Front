function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '0.5px solid rgba(0,0,0,0.14)', padding: '32px 24px', marginTop: '48px' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px' }}>
        <div>
          {/* ✅ Navbar 로고와 동일한 스타일 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(67,56,202,0.3)'
            }}>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>D</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
              Dev<span style={{ color: '#4338CA' }}>Link</span>
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px', lineHeight: 1.6 }}>
            개발자 취준생을 위한<br/>커뮤니티 플랫폼
          </p>
        </div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '10px' }}>서비스</div>
            {['게시판', '스터디 모집', '채팅', '알림'].map(item => (
              <div key={item} style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '7px', cursor: 'pointer' }}>{item}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '10px' }}>계정</div>
            {['로그인', '회원가입', '마이페이지'].map(item => (
              <div key={item} style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '7px', cursor: 'pointer' }}>{item}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '10px' }}>DevLink</div>
            {['서비스 소개', '이용약관', '개인정보처리방침', '문의하기'].map(item => (
              <div key={item} style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '7px', cursor: 'pointer' }}>{item}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer