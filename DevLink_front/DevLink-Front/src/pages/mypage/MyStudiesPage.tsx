import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

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
  const { success, error } = useToastStore()

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

  const handleEdit = (e: React.MouseEvent, studyId: number) => {
    e.stopPropagation()
    navigate(`/studies/${studyId}/edit`)
  }

  const handleClose = async (e: React.MouseEvent, studyId: number) => {
    e.stopPropagation()
    if (!confirm('모집을 마감하시겠습니까?')) return
    try {
      await api.patch(`/api/studies/${studyId}/close`)
      setStudies(prev => prev.map(s =>
        s.studyId === studyId ? { ...s, status: 'CLOSED' } : s
      ))
      success('모집이 마감되었습니다.')
    } catch (e) {
      console.error('모집 마감 실패', e)
      error('모집 마감에 실패했습니다.')
    }
  }

  const handleDelete = async (e: React.MouseEvent, studyId: number) => {
    e.stopPropagation()
    if (!confirm('스터디를 삭제하시겠습니까?')) return
    try {
      await api.delete(`/api/studies/${studyId}`)
      setStudies(prev => prev.filter(s => s.studyId !== studyId))
      success('스터디가 삭제되었습니다.')
    } catch (e) {
      console.error('스터디 삭제 실패', e)
      error('스터디 삭제에 실패했습니다.')
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', color: '#6B7280',
            cursor: 'pointer', fontSize: '13px', padding: '0',
            marginBottom: '8px', display: 'block'
          }}
        >
          ← 뒤로가기
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
              {/* 상태 배지 + 버튼들 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={e => handleEdit(e, study.studyId)}
                    style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                      background: '#F9FAFB', color: '#374151',
                      border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                    onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}
                  >
                    수정
                  </button>
                  {study.status === 'OPEN' && (
                    <button
                      onClick={e => handleClose(e, study.studyId)}
                      style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                        background: '#FFFBEB', color: '#92400E',
                        border: '1px solid #FDE68A', cursor: 'pointer', transition: 'all 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FEF3C7'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFFBEB'}
                    >
                      모집마감
                    </button>
                  )}
                  <button
                    onClick={e => handleDelete(e, study.studyId)}
                    style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                      background: '#FEF2F2', color: '#DC2626',
                      border: '1px solid #FECACA', cursor: 'pointer', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                  >
                    삭제
                  </button>
                </div>
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