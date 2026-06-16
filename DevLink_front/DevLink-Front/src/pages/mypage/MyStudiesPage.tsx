import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  createdAt: string
}

function MyStudiesPage() {
  const navigate = useNavigate()
  const [studies, setStudies] = useState<Study[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyStudies = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/users/me/studies')
        setStudies(res.data.data || [])
      } catch (e) {
        console.error('내 스터디 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchMyStudies()
  }, [])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/mypage')}
          style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}
        >
          ← 마이페이지
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>내 스터디</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>로딩 중...</div>
      ) : studies.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {studies.map(study => (
            <div
              key={study.studyId}
              onClick={() => navigate(`/studies/${study.studyId}`)}
              style={{
                background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)',
                padding: '16px 20px', cursor: 'pointer', transition: 'all 0.15s'
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
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
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                {study.title}
              </div>
              <div style={{
                fontSize: '13px', color: '#6B7280', marginBottom: '10px',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'
              }}>
                {study.description}
              </div>
              {study.techStacks && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF' }}>
                <span>{formatDate(study.createdAt)}</span>
                {study.deadline && <span>마감일 {formatDate(study.deadline)}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
          작성한 스터디 모집글이 없습니다
        </div>
      )}
    </div>
  )
}

export default MyStudiesPage