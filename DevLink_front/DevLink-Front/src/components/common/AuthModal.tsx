import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../service/api'

const TERMS_CONTENT = {
  terms: {
    title: '서비스 이용약관',
    content: `제1조 (목적)
본 약관은 DevLink (이하 "회사")가 제공하는 개발자 취준생 커뮤니티 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 회사가 제공하는 개발자 취업 준비 커뮤니티 플랫폼을 의미합니다.
② "이용자"란 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 말합니다.
③ "회원"이란 회사에 개인정보를 제공하여 회원 등록을 한 자로, 서비스를 지속적으로 이용할 수 있는 자를 말합니다.

제3조 (약관의 효력 및 변경)
① 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
② 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 사전 고지합니다.

제4조 (서비스 이용)
① 서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 1일 24시간을 원칙으로 합니다.
② 회사는 서비스의 일부 또는 전부를 회사의 정책 및 운영상의 필요에 따라 수정, 중단, 변경할 수 있습니다.

제5조 (회원의 의무)
① 이용자는 서비스 이용 시 타인의 정보를 도용하거나 허위 정보를 입력해서는 안 됩니다.
② 이용자는 서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복제, 유통, 상업적으로 이용할 수 없습니다.

제6조 (개인정보 보호)
회사는 이용자의 개인정보를 보호하기 위해 개인정보 처리방침을 수립하고 이를 준수합니다.

부칙
본 약관은 2026년 6월 4일부터 시행합니다.`
  },
  privacy: {
    title: '개인정보 처리방침',
    content: `DevLink (이하 "회사")는 이용자의 개인정보를 중요시하며, 개인정보 보호법 등 관련 법령을 준수합니다.

1. 수집하는 개인정보 항목
① 필수항목: 이메일, 비밀번호, 닉네임
② 자동수집항목: IP 주소, 쿠키, 서비스 이용 기록

2. 개인정보 수집 및 이용 목적
① 회원 가입 및 관리
② 서비스 제공 및 개선
③ 게시글 및 스터디 이용 내역 관리
④ 고객 문의 응대 및 불만 처리

3. 개인정보 보유 및 이용기간
① 회원 탈퇴 시까지 보유
② 관련 법령에 의한 보존 필요 시 해당 기간까지 보유

4. 개인정보의 제3자 제공
회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.

5. 개인정보 처리 위탁
- 카카오: 소셜 로그인 서비스 제공
- 네이버: 소셜 로그인 서비스 제공

6. 이용자의 권리
① 이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다.

본 방침은 2026년 6월 4일부터 시행됩니다.`
  },
  marketing: {
    title: '마케팅 수신 동의',
    content: `DevLink의 마케팅 정보 수신에 동의하시면 아래와 같은 혜택을 받으실 수 있습니다.

1. 수신 동의 항목
① 이메일을 통한 마케팅 정보 수신
② 새로운 스터디 모집 알림
③ 이벤트 및 프로모션 안내
④ 맞춤형 취업 정보 추천

2. 동의 거부 권리
마케팅 수신 동의는 선택사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다.

본 동의는 2026년 6월 4일부터 시행됩니다.`
  }
}

function AuthModal() {
  const { activeModal, closeModal } = useAuthStore()
  const [tab, setTab] = useState<'LOGIN' | 'JOIN'>('LOGIN')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [termsModal, setTermsModal] = useState<'terms' | 'privacy' | 'marketing' | null>(null)

  useEffect(() => {
    if (activeModal === 'LOGIN') setTab('LOGIN')
    if (activeModal === 'JOIN') setTab('JOIN')
  }, [activeModal])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (termsModal) setTermsModal(null)
        else closeModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [termsModal])

  useEffect(() => {
    if (activeModal !== 'NONE') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [activeModal])

  if (activeModal === 'NONE') return null

  // ── 약관 모달 ──────────────────────────────────────────────
  if (termsModal) {
    const content = TERMS_CONTENT[termsModal]
    return (
      <div
        onClick={() => setTermsModal(null)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ background: '#fff', width: '100%', maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}
        >
          <div style={{ height: '3px', background: '#4338CA' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid #eee' }}>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#444' }}>{content.title}</span>
            <button onClick={() => setTermsModal(null)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>
          <div style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
            <pre style={{ fontSize: '12px', lineHeight: 1.8, color: '#666', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
              {content.content}
            </pre>
          </div>
          <div style={{ padding: '16px 20px', borderTop: '0.5px solid #eee' }}>
            <button
              onClick={() => setTermsModal(null)}
              style={{ width: '100%', background: '#4338CA', border: 'none', padding: '12px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 500, borderRadius: '6px' }}>
              확인
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── 로그인 폼 ──────────────────────────────────────────────
  const LoginForm = () => {
    const { login, closeModal } = useAuthStore()
    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const [errors, setErrors] = useState<{ email?: string; pw?: string }>({})
    const [serverError, setServerError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const validate = () => {
      const errs: { email?: string; pw?: string } = {}
      if (!email.trim()) errs.email = '이메일을 입력해주세요'
      if (!pw.trim()) errs.pw = '비밀번호를 입력해주세요'
      setErrors(errs)
      return Object.keys(errs).length === 0
    }

    const handleSubmit = async () => {
      if (!validate() || isLoading) return
      setIsLoading(true)
      setServerError('')
      try {
        const res = await api.post('/api/auth/login', { email, password: pw })
        const { userId, email: userEmail, nickname, role, accessToken } = res.data.data
        login(userId, userEmail, nickname, role, accessToken)
        closeModal()
      } catch (err: any) {
        setServerError(err.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div>
        <div style={{ fontSize: '28px', fontWeight: 600, color: '#111827', letterSpacing: '-0.5px', marginBottom: '20px' }}>로그인</div>
        <div style={{ marginBottom: '10px' }}>
          <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', background: '#fafafa', border: `1px solid ${errors.email ? '#EF4444' : '#e8e8e8'}`, padding: '12px 14px', color: '#111', fontSize: '13px', outline: 'none', boxSizing: 'border-box', borderRadius: '6px' }} />
          {errors.email && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>✕ {errors.email}</div>}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input type="password" placeholder="비밀번호" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', background: '#fafafa', border: `1px solid ${errors.pw ? '#EF4444' : '#e8e8e8'}`, padding: '12px 14px', color: '#111', fontSize: '13px', outline: 'none', boxSizing: 'border-box', borderRadius: '6px' }} />
          {errors.pw && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>✕ {errors.pw}</div>}
        </div>
        {serverError && (
          <div style={{ fontSize: '12px', color: '#EF4444', marginBottom: '6px' }}>✕ {serverError}</div>
        )}
        <button onClick={handleSubmit} disabled={isLoading}
          style={{ width: '100%', background: isLoading ? '#aaa' : '#4338CA', border: 'none', padding: '14px', color: '#fff', fontSize: '14px', cursor: isLoading ? 'default' : 'pointer', marginTop: '8px', fontWeight: 500, borderRadius: '6px', transition: 'background 0.2s' }}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '0.5px', background: '#eee' }} />
          <span style={{ fontSize: '12px', color: '#bbb' }}>소셜 로그인</span>
          <div style={{ flex: 1, height: '0.5px', background: '#eee' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/kakao`}
            style={{ flex: 1, background: '#FEE500', border: 'none', padding: '12px 8px', color: '#3C1E1E', fontSize: '13px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', borderRadius: '6px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#3C1E1E', color: '#FEE500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900 }}>K</div>
            카카오 로그인
          </button>
          <button
            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/naver`}
            style={{ flex: 1, background: '#03C75A', border: 'none', padding: '12px 8px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', borderRadius: '6px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#fff', color: '#03C75A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900 }}>N</div>
            네이버 로그인
          </button>
        </div>
        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: '#bbb' }}>
          아직 회원이 아니신가요?{' '}
          <span onClick={() => setTab('JOIN')} style={{ color: '#4338CA', cursor: 'pointer', fontWeight: 500 }}>회원가입 →</span>
        </div>
      </div>
    )
  }

  // ── 회원가입 폼 ────────────────────────────────────────────
  const JoinForm = () => {
    const [form, setForm] = useState({ email: '', code: '', pw: '', pwConfirm: '', nickname: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [emailVerified, setEmailVerified] = useState(false)
    const [codeSent, setCodeSent] = useState(false)
    const [timer, setTimer] = useState(180)
    const [agrees, setAgrees] = useState({ all: false, terms: false, privacy: false, marketing: false })
    const [serverError, setServerError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      if (!codeSent || emailVerified || timer <= 0) return
      const interval = setInterval(() => setTimer(t => t - 1), 1000)
      return () => clearInterval(interval)
    }, [codeSent, emailVerified, timer])

    const formatTimer = () => {
      const m = Math.floor(timer / 60)
      const s = timer % 60
      return `${m}:${s.toString().padStart(2, '0')}`
    }

    const handleChange = (key: string, value: string) => {
      setForm(prev => ({ ...prev, [key]: value }))
      setErrors(prev => ({ ...prev, [key]: '' }))
    }

    const handleAgree = (key: string) => {
      if (key === 'all') {
        const next = !agrees.all
        setAgrees({ all: next, terms: next, privacy: next, marketing: next })
      } else {
        const next = { ...agrees, [key]: !agrees[key as keyof typeof agrees] }
        next.all = next.terms && next.privacy && next.marketing
        setAgrees(next)
      }
    }

    const handleSendCode = async () => {
      if (!form.email.trim()) { setErrors(p => ({ ...p, email: '이메일을 입력해주세요' })); return }
      try {
        await api.post('/api/auth/email/send', { email: form.email })
        setCodeSent(true); setTimer(180)
        setErrors(p => ({ ...p, email: '' }))
      } catch {
        setErrors(p => ({ ...p, email: '인증 메일 발송에 실패했습니다' }))
      }
    }

    const handleVerifyCode = async () => {
      if (!form.code.trim()) { setErrors(p => ({ ...p, code: '인증번호를 입력해주세요' })); return }
      try {
        await api.post('/api/auth/email/verify', { email: form.email, code: form.code })
        setEmailVerified(true)
        setErrors(p => ({ ...p, code: '' }))
      } catch (err: any) {
        setErrors(p => ({ ...p, code: err.response?.data?.message || '인증번호가 올바르지 않습니다' }))
      }
    }

    const validate = () => {
      const errs: Record<string, string> = {}
      if (!form.email.trim()) errs.email = '이메일을 입력해주세요'
      else if (!emailVerified) errs.email = '이메일 인증을 완료해주세요'
      if (!form.pw.trim()) errs.pw = '비밀번호를 입력해주세요'
      else if (form.pw.length < 8) errs.pw = '비밀번호는 8자 이상이어야 합니다'
      if (!form.pwConfirm.trim()) errs.pwConfirm = '비밀번호 확인을 입력해주세요'
      else if (form.pw !== form.pwConfirm) errs.pwConfirm = '비밀번호가 일치하지 않습니다'
      if (!form.nickname.trim()) errs.nickname = '닉네임을 입력해주세요'
      if (!agrees.terms) errs.terms = '필수 약관에 동의해주세요'
      if (!agrees.privacy) errs.privacy = '필수 약관에 동의해주세요'
      setErrors(errs)
      return Object.keys(errs).length === 0
    }

    const handleSubmit = async () => {
      if (!validate() || isLoading) return
      setIsLoading(true)
      setServerError('')
      try {
        await api.post('/api/auth/signup', {
          email: form.email,
          password: form.pw,
          nickname: form.nickname,
        })
        setTab('LOGIN')
      } catch (err: any) {
        setServerError(err.response?.data?.message || '회원가입에 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    const inputStyle = (key: string): React.CSSProperties => ({
      width: '100%', background: '#fafafa',
      border: `1px solid ${errors[key] ? '#EF4444' : key === 'email' && emailVerified ? '#059669' : '#e8e8e8'}`,
      padding: '12px 14px', color: '#111', fontSize: '13px',
      outline: 'none', boxSizing: 'border-box' as const, borderRadius: '6px'
    })

    const btnInlineStyle: React.CSSProperties = {
      background: '#4338CA', border: 'none', color: '#fff', fontSize: '12px',
      padding: '0 14px', cursor: 'pointer', whiteSpace: 'nowrap',
      fontWeight: 500, borderRadius: '6px', height: '42px'
    }

    return (
      <div>
        <div style={{ fontSize: '28px', fontWeight: 600, color: '#111827', letterSpacing: '-0.5px', marginBottom: '20px' }}>회원가입</div>

        {/* 이메일 */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input type="email" placeholder="이메일" value={form.email} onChange={e => handleChange('email', e.target.value)} style={{ ...inputStyle('email'), flex: 1 }} />
            <button onClick={handleSendCode} style={btnInlineStyle}>인증 발송</button>
          </div>
          {errors.email && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>✕ {errors.email}</div>}
        </div>

        {/* 인증코드 */}
        {codeSent && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input type="text" placeholder="인증번호 6자리" value={form.code} onChange={e => handleChange('code', e.target.value)} style={{ ...inputStyle('code'), flex: 1 }} />
              <button onClick={handleVerifyCode} style={btnInlineStyle}>확인</button>
              {!emailVerified && <span style={{ fontSize: '12px', color: '#EF4444', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{formatTimer()}</span>}
              {emailVerified && <span style={{ fontSize: '12px', color: '#059669', whiteSpace: 'nowrap' }}>✓ 완료</span>}
            </div>
            {errors.code && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>✕ {errors.code}</div>}
          </div>
        )}

        {/* 비밀번호 */}
        <div style={{ marginBottom: '10px' }}>
          <input type="password" placeholder="비밀번호 (8자 이상)" value={form.pw} onChange={e => handleChange('pw', e.target.value)} style={inputStyle('pw')} />
          {errors.pw && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>✕ {errors.pw}</div>}
        </div>

        {/* 비밀번호 확인 */}
        <div style={{ marginBottom: '10px' }}>
          <input type="password" placeholder="비밀번호 확인" value={form.pwConfirm} onChange={e => handleChange('pwConfirm', e.target.value)} style={inputStyle('pwConfirm')} />
          {errors.pwConfirm && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>✕ {errors.pwConfirm}</div>}
        </div>

        {/* 닉네임 */}
        <div style={{ marginBottom: '10px' }}>
          <input type="text" placeholder="닉네임 (2~10자)" value={form.nickname} onChange={e => handleChange('nickname', e.target.value)} style={inputStyle('nickname')} />
          {errors.nickname && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>✕ {errors.nickname}</div>}
        </div>

        {/* 약관 */}
        <div style={{ border: '1px solid #eee', padding: '14px 16px', background: '#fafafa', margin: '14px 0 8px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
            <input type="checkbox" checked={agrees.all} onChange={() => handleAgree('all')} style={{ accentColor: '#4338CA', width: '14px', height: '14px', cursor: 'pointer' }} />
            <label style={{ fontSize: '14px', color: '#111', cursor: 'pointer', fontWeight: 700 }}>전체 동의</label>
          </div>
          {[
            { key: 'terms', label: '서비스 이용약관', required: true },
            { key: 'privacy', label: '개인정보 처리방침', required: true },
            { key: 'marketing', label: '마케팅 수신 동의', required: false },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={agrees[item.key as keyof typeof agrees] as boolean} onChange={() => handleAgree(item.key)} style={{ accentColor: '#4338CA', width: '14px', height: '14px', cursor: 'pointer' }} />
                <label style={{ fontSize: '13px', color: '#888', cursor: 'pointer' }}>
                  <span style={{ color: item.required ? '#4338CA' : '#bbb', fontWeight: 500 }}>[{item.required ? '필수' : '선택'}]</span> {item.label}
                </label>
              </div>
              <span onClick={() => setTermsModal(item.key as 'terms' | 'privacy' | 'marketing')}
                style={{ fontSize: '12px', color: '#bbb', cursor: 'pointer', textDecoration: 'underline' }}>보기</span>
            </div>
          ))}
        </div>
        {(errors.terms || errors.privacy) && <div style={{ fontSize: '12px', color: '#EF4444', marginBottom: '6px' }}>✕ 필수 약관에 동의해주세요</div>}

        {/* 소셜 간편가입 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0 10px' }}>
          <div style={{ flex: 1, height: '0.5px', background: '#eee' }} />
          <span style={{ fontSize: '12px', color: '#bbb' }}>소셜로 간편 가입</span>
          <div style={{ flex: 1, height: '0.5px', background: '#eee' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/kakao`}
            style={{ flex: 1, background: '#FEE500', border: 'none', padding: '12px 8px', color: '#3C1E1E', fontSize: '13px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', borderRadius: '6px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#3C1E1E', color: '#FEE500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900 }}>K</div>
            카카오로 가입
          </button>
          <button
            onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/naver`}
            style={{ flex: 1, background: '#03C75A', border: 'none', padding: '12px 8px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', borderRadius: '6px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#fff', color: '#03C75A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900 }}>N</div>
            네이버로 가입
          </button>
        </div>

        {serverError && <div style={{ fontSize: '12px', color: '#EF4444', marginBottom: '6px' }}>✕ {serverError}</div>}
        <button onClick={handleSubmit} disabled={isLoading}
          style={{ width: '100%', background: isLoading ? '#aaa' : '#4338CA', border: 'none', padding: '14px', color: '#fff', fontSize: '14px', cursor: isLoading ? 'default' : 'pointer', fontWeight: 500, borderRadius: '6px', transition: 'background 0.2s' }}>
          {isLoading ? '가입 중...' : '회원가입'}
        </button>

        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: '#bbb' }}>
          이미 회원이신가요?{' '}
          <span onClick={() => setTab('LOGIN')} style={{ color: '#4338CA', cursor: 'pointer', fontWeight: 500 }}>로그인 →</span>
        </div>
      </div>
    )
  }

  // ── 모달 공통 레이아웃 ──────────────────────────────────────
  const modalContent = (
    <div style={{
      background: '#fff',
      border: '1px solid #e0e0e0',
      width: '100%',
      maxWidth: isMobile ? '100%' : '420px',
      position: 'relative',
      borderRadius: isMobile ? '16px 16px 0 0' : '12px',
      overflow: 'hidden'
    }}>
      <div style={{ height: '3px', background: '#4338CA' }} />
      {isMobile && <div style={{ width: '36px', height: '4px', background: '#ddd', borderRadius: '2px', margin: '10px auto 0' }} />}
      <div style={{ padding: isMobile ? '16px 20px 24px' : '32px 32px 28px' }}>
        {!isMobile && (
          <button onClick={closeModal} style={{ position: 'absolute', top: '14px', right: '16px', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        )}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '24px' }}>
          {(['LOGIN', 'JOIN'] as const).map(t => (
            <div key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontSize: '13px', fontWeight: 500, letterSpacing: '1px', cursor: 'pointer', color: tab === t ? '#4338CA' : '#bbb', borderBottom: tab === t ? '2px solid #4338CA' : '2px solid transparent', transition: '0.2s' }}>
              {t === 'LOGIN' ? '로그인' : '회원가입'}
            </div>
          ))}
        </div>
        {tab === 'LOGIN' ? <LoginForm /> : <JoinForm />}
      </div>
    </div>
  )

  if (!isMobile) {
    return (
      <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div onClick={e => e.stopPropagation()}>{modalContent}</div>
      </div>
    )
  }

  return (
    <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        {modalContent}
      </div>
    </div>
  )
}

export default AuthModal