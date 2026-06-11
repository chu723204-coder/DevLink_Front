function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '0.5px solid rgba(0,0,0,0.14)', padding: '32px 24px', marginTop: '48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#4338CA' }}>Dev<span style={{ color: '#111827' }}>Link</span></div>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px', lineHeight: 1.6 }}>개발자 취준생을 위한<br/>커뮤니티 플랫폼</p>
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
      <div style={{ maxWidth: '1200px', margin: '20px auto 0', paddingTop: '16px', borderTop: '0.5px solid rgba(0,0,0,0.08)', fontSize: '11px', color: '#9CA3AF' }}>
        © 2026 DevLink. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer