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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>스터디 모집</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setOpenOnly(!openOnly)}
            style={{
              padding: '6px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
              background: openOnly ? '#4338CA' : '#F3F4F6',
              color: openOnly ? '#fff' : '#374151',
              border: 'none', fontWeight: 500
            }}
          >
            {openOnly ? '✓ 모집 중만' : '모집 중만'}
          </button>
          {isLoggedIn && (
            <button
              onClick={() => navigate('/studies/write')}
              style={{
                padding: '7px 16px', borderRadius: '8px', fontSize: '13px',
                fontWeight: 500, color: '#fff', background: '#4338CA', border: 'none', cursor: 'pointer'
              }}
            >
              모집 글쓰기
            </button>
          )}
        </div>
      </div>

      {/* 스터디 목록 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>로딩 중...</div>
      ) : studies.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {studies.map(study => (
            <div
              key={study.studyId}
              onClick={() => navigate(`/studies/${study.studyId}`)}
              style={{
                background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)',
                padding: '20px', cursor: 'pointer', transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#4338CA'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(67,56,202,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* 상태 뱃지 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                  background: study.status === 'OPEN' ? '#ECFDF5' : '#F3F4F6',
                  color: study.status === 'OPEN' ? '#059669' : '#6B7280'
                }}>
                  {study.status === 'OPEN' ? '모집 중' : '모집 마감'}
                </span>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {study.currentMembers}/{study.maxMembers}명
                </span>
              </div>

              {/* 제목 */}
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                {study.title}
              </div>

              {/* 설명 */}
              <div style={{
                fontSize: '13px', color: '#6B7280', marginBottom: '12px',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
              }}>
                {study.description}
              </div>

              {/* 기술 스택 */}
              {study.techStacks && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {study.techStacks.split(',').map(stack => (
                    <span key={stack} style={{
                      padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
                      background: '#EEF2FF', color: '#4338CA'
                    }}>
                      {stack.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* 하단 정보 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{study.nickname}</span>
                {study.deadline && (
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    마감 {formatDate(study.deadline)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
          스터디 모집글이 없습니다
        </div>
      )}
    </div>
  )
}

export default StudyListPage