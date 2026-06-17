import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../service/api'

interface Study {
  studyId: number
  title: string
  description: string
  techStacks: string
  maxMembers: number
  currentMembers: number
  deadline: string
  status: 'OPEN' | 'CLOSED'
  nickname: string
  createdAt: string
}

const avatarColors = [
  { bg: '#EEF2FF', color: '#4338CA' },
  { bg: '#FDF2F8', color: '#9D174D' },
  { bg: '#F0FDF4', color: '#166534' },
  { bg: '#FFFBEB', color: '#92400E' },
  { bg: '#F0F9FF', color: '#0369A1' },
  { bg: '#FFF7ED', color: '#C2410C' },
]

function getAvatarColor(nickname: string) {
  const index = (nickname?.charCodeAt(0) || 0) % avatarColors.length
  return avatarColors[index]
}

function StudyListPage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()
  const [studies, setStudies] = useState<Study[]>([])
  const [loading, setLoading] = useState(true)
  const [openOnly, setOpenOnly] = useState(false)

  useEffect(() => {
    const fetchStudies = async () => {
      setLoading(true)
      try {
        const params = openOnly ? { openOnly: true } : {}
        const res = await api.get('/api/studies', { params })
        setStudies(res.data.data || [])
      } catch (e) {
        console.error('스터디 목록 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStudies()
  }, [openOnly])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  const filteredStudies = openOnly
    ? studies.filter(s => s.status === 'OPEN')
    : studies

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 60px' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>스터디 모집</h1>
          {!loading && (
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
              총 {filteredStudies.length}개의 스터디
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* ✅ 모집 중만 필터 토글 */}
          <div style={{
            display: 'flex', background: '#F3F4F6',
            borderRadius: '8px', padding: '3px', gap: '2px'
          }}>
            <button
              onClick={() => setOpenOnly(false)}
              style={{
                padding: '5px 12px', borderRadius: '6px', fontSize: '13px',
                fontWeight: !openOnly ? 600 : 400,
                color: !openOnly ? '#4338CA' : '#6B7280',
                background: !openOnly ? '#fff' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                boxShadow: !openOnly ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              전체
            </button>
            <button
              onClick={() => setOpenOnly(true)}
              style={{
                padding: '5px 12px', borderRadius: '6px', fontSize: '13px',
                fontWeight: openOnly ? 600 : 400,
                color: openOnly ? '#4338CA' : '#6B7280',
                background: openOnly ? '#fff' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                boxShadow: openOnly ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              모집 중
            </button>
          </div>

          {isLoggedIn && (
            <button
              onClick={() => navigate('/studies/write')}
              style={{
                padding: '7px 16px', borderRadius: '8px', fontSize: '13px',
                fontWeight: 600, color: '#fff', background: '#4338CA',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(67,56,202,0.3)', transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
              onMouseLeave={e => e.currentTarget.style.background = '#4338CA'}
            >
              ✏️ 모집 글쓰기
            </button>
          )}
        </div>
      </div>

      {/* 스터디 목록 */}
      {loading ? (
        // ✅ 로딩 스켈레톤
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#fff', borderRadius: '12px',
              border: '1px solid #F3F4F6', padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '60px', height: '20px', background: '#F3F4F6', borderRadius: '20px' }} />
                <div style={{ width: '40px', height: '20px', background: '#F3F4F6', borderRadius: '4px' }} />
              </div>
              <div style={{ width: '70%', height: '18px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '10px' }} />
              <div style={{ width: '100%', height: '13px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '6px' }} />
              <div style={{ width: '80%', height: '13px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '14px' }} />
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                <div style={{ width: '50px', height: '20px', background: '#F3F4F6', borderRadius: '20px' }} />
                <div style={{ width: '50px', height: '20px', background: '#F3F4F6', borderRadius: '20px' }} />
              </div>
              <div style={{ width: '100%', height: '1px', background: '#F9FAFB', marginBottom: '12px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '60px', height: '12px', background: '#F9FAFB', borderRadius: '4px' }} />
                <div style={{ width: '80px', height: '12px', background: '#F9FAFB', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredStudies.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filteredStudies.map(study => {
            const avatar = getAvatarColor(study.nickname)
            const memberRatio = study.currentMembers / study.maxMembers
            const isFull = study.currentMembers >= study.maxMembers

            return (
              <div
                key={study.studyId}
                onClick={() => navigate(`/studies/${study.studyId}`)}
                style={{
                  background: '#fff', borderRadius: '12px',
                  border: '1px solid #F3F4F6', padding: '20px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C7D2FE'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(67,56,202,0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#F3F4F6'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* ✅ 상태 뱃지 + 인원 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: study.status === 'OPEN' ? '#ECFDF5' : '#F3F4F6',
                    color: study.status === 'OPEN' ? '#059669' : '#6B7280'
                  }}>
                    {study.status === 'OPEN' ? '🟢 모집 중' : '⛔ 모집 마감'}
                  </span>
                  <span style={{
                    fontSize: '12px', fontWeight: 600,
                    color: isFull ? '#DC2626' : '#4338CA'
                  }}>
                    {study.currentMembers}/{study.maxMembers}명
                  </span>
                </div>

                {/* 제목 */}
                <div style={{
                  fontSize: '15px', fontWeight: 700, color: '#111827',
                  marginBottom: '8px', lineHeight: '1.4'
                }}>
                  {study.title}
                </div>

                {/* 설명 */}
                <div style={{
                  fontSize: '13px', color: '#6B7280', marginBottom: '12px',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.6'
                }}>
                  {study.description}
                </div>

                {/* 기술 스택 */}
                {study.techStacks && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {study.techStacks.split(',').slice(0, 4).map(stack => (
                      <span key={stack} style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                        background: '#EEF2FF', color: '#4338CA', fontWeight: 500
                      }}>
                        {stack.trim()}
                      </span>
                    ))}
                    {study.techStacks.split(',').length > 4 && (
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                        background: '#F3F4F6', color: '#6B7280', fontWeight: 500
                      }}>
                        +{study.techStacks.split(',').length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* ✅ 인원 진행바 */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{
                    width: '100%', height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${memberRatio * 100}%`, height: '100%', borderRadius: '2px',
                      background: isFull ? '#DC2626' : '#4338CA',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #F9FAFB', marginBottom: '12px' }} />

                {/* 작성자 + 마감일 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: avatar.bg, color: avatar.color,
                      fontSize: '10px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {study.nickname?.charAt(0)}
                    </div>
                    <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>
                      {study.nickname}
                    </span>
                  </div>
                  {study.deadline && (
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      마감 {formatDate(study.deadline)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // ✅ 빈 상태
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          background: '#fff', borderRadius: '12px', border: '1px solid #F3F4F6'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📚</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            아직 스터디 모집글이 없어요
          </div>
          <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>
            첫 번째 스터디를 모집해보세요!
          </div>
          {isLoggedIn && (
            <button
              onClick={() => navigate('/studies/write')}
              style={{
                padding: '8px 20px', borderRadius: '8px', fontSize: '13px',
                fontWeight: 600, color: '#fff', background: '#4338CA',
                border: 'none', cursor: 'pointer'
              }}
            >
              모집 글쓰기
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default StudyListPage