import { useState, useEffect } from 'react'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

interface Study {
  studyId: number
  title: string
  nickname: string
  status: string
  techStack: string
  createdAt: string
}

function AdminStudiesPage() {
  const [studies, setStudies] = useState<Study[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error } = useToastStore()

  useEffect(() => {
    fetchStudies()
  }, [])

  const fetchStudies = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/studies')
      setStudies(res.data.data || [])
    } catch (e) {
      console.error('스터디 목록 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseStudy = async (studyId: number, title: string) => {
    if (!window.confirm(`[${title}] 스터디를 강제 마감하시겠습니까?`)) return
    try {
      await api.patch(`/api/admin/studies/${studyId}/close`)
      setStudies(prev => prev.map(s => s.studyId === studyId ? { ...s, status: 'CLOSED' } : s))
      success('스터디가 마감되었습니다.')
    } catch (e) {
      console.error('스터디 마감 실패', e)
      error('처리에 실패했습니다.')
    }
  }

  const handleDeleteStudy = async (studyId: number, title: string) => {
    if (!window.confirm(`[${title}] 스터디를 강제 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return
    try {
      await api.delete(`/api/admin/studies/${studyId}`)
      setStudies(prev => prev.filter(s => s.studyId !== studyId))
      success('스터디가 삭제되었습니다.')
    } catch (e) {
      console.error('스터디 삭제 실패', e)
      error('처리에 실패했습니다.')
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('ko-KR')

  const statusLabel: Record<string, { label: string; bg: string; color: string }> = {
    OPEN: { label: '모집중', bg: '#ECFDF5', color: '#059669' },
    CLOSED: { label: '마감', bg: '#F3F4F6', color: '#6B7280' },
    COMPLETED: { label: '완료', bg: '#EEF2FF', color: '#4338CA' },
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>
          📚 스터디 관리
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '6px 0 0 0' }}>
          총 {studies.length}개
        </p>
      </div>

      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 120px 100px 120px 120px',
          padding: '12px 20px', background: '#F9FAFB',
          borderBottom: '1px solid #F3F4F6',
          fontSize: '12px', fontWeight: 600, color: '#6B7280'
        }}>
          <div>ID</div>
          <div>제목</div>
          <div>작성자</div>
          <div>상태</div>
          <div>작성일</div>
          <div>관리</div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
            불러오는 중...
          </div>
        ) : studies.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
            스터디가 없습니다
          </div>
        ) : (
          studies.map((study, idx) => (
            <div
              key={study.studyId}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 120px 100px 120px 120px',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: idx < studies.length - 1 ? '1px solid #F9FAFB' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{study.studyId}</div>
              <div style={{
                fontSize: '13px', fontWeight: 600, color: '#111827',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                paddingRight: '12px'
              }}>
                {study.title}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{study.nickname}</div>
              <div>
                <span style={{
                  padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                  background: statusLabel[study.status]?.bg || '#F3F4F6',
                  color: statusLabel[study.status]?.color || '#6B7280'
                }}>
                  {statusLabel[study.status]?.label || study.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{formatDate(study.createdAt)}</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {study.status === 'OPEN' && (
                  <button
                    onClick={() => handleCloseStudy(study.studyId, study.title)}
                    style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                      fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      background: '#FEF9C3', color: '#92400E',
                      border: '1px solid #FDE68A'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF08A'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FEF9C3'}
                  >
                    마감
                  </button>
                )}
                <button
                  onClick={() => handleDeleteStudy(study.studyId, study.title)}
                  style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    background: '#FEF2F2', color: '#DC2626',
                    border: '1px solid #FECACA'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminStudiesPage