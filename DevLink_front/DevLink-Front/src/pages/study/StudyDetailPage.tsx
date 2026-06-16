import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useToastStore } from '../../store/toastStore'
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

interface Apply {
  studyApplyId: number
  userId: number
  nickname: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
}

function StudyDetailPage() {
  const { studyId } = useParams<{ studyId: string }>()
  const navigate = useNavigate()
  const { isLoggedIn, nickname } = useAuthStore()
  const { showToast } = useToastStore()
  const [study, setStudy] = useState<Study | null>(null)
  const [applies, setApplies] = useState<Apply[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    const fetchStudy = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/studies/${studyId}`)
        setStudy(res.data.data)
      } catch (e) {
        console.error('스터디 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStudy()
  }, [studyId])

  const fetchApplies = async () => {
    try {
      const res = await api.get(`/api/studies/${studyId}/applies`)
      setApplies(res.data.data || [])
    } catch (e) {
      console.error('지원자 목록 조회 실패', e)
    }
  }

  useEffect(() => {
    if (study && isLoggedIn && study.nickname === nickname) {
      fetchApplies()
    }
  }, [study])

  const handleApply = async () => {
    if (!isLoggedIn) return alert('로그인이 필요합니다.')
    setApplying(true)
    try {
      await api.post(`/api/studies/${studyId}/apply`)
      showToast('스터디에 지원했습니다.', 'success')
    } catch (e: any) {
      const msg = e.response?.data?.message || '지원에 실패했습니다.'
      showToast(msg, 'error')
    } finally {
      setApplying(false)
    }
  }

  const handleAccept = async (studyApplyId: number) => {
    try {
      await api.patch(`/api/studies/applies/${studyApplyId}/accept`)
      showToast('지원을 수락했습니다.', 'success')
      setApplies(prev => prev.map(a => a.studyApplyId === studyApplyId ? { ...a, status: 'ACCEPTED' } : a))
      setStudy(prev => prev ? { ...prev, currentMembers: prev.currentMembers + 1 } : prev)
    } catch (e: any) {
      const msg = e.response?.data?.message || '수락에 실패했습니다.'
      showToast(msg, 'error')
    }
  }

  const handleReject = async (studyApplyId: number) => {
    try {
      await api.patch(`/api/studies/applies/${studyApplyId}/reject`)
      showToast('지원을 거절했습니다.', 'success')
      setApplies(prev => prev.map(a => a.studyApplyId === studyApplyId ? { ...a, status: 'REJECTED' } : a))
    } catch (e: any) {
      const msg = e.response?.data?.message || '거절에 실패했습니다.'
      showToast(msg, 'error')
    }
  }

  const handleClose = async () => {
    if (!confirm('모집을 마감하시겠습니까?')) return
    try {
      await api.patch(`/api/studies/${studyId}/close`)
      showToast('모집이 마감되었습니다.', 'success')
      setStudy(prev => prev ? { ...prev, status: 'CLOSED' } : prev)
    } catch (e) {
      showToast('마감 처리에 실패했습니다.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!confirm('스터디를 삭제하시겠습니까?')) return
    try {
      await api.delete(`/api/studies/${studyId}`)
      showToast('스터디가 삭제되었습니다.', 'success')
      navigate('/studies')
    } catch (e) {
      showToast('삭제에 실패했습니다.', 'error')
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>로딩 중...</div>
  )

  if (!study) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>스터디를 찾을 수 없습니다.</div>
  )

  const isOwner = isLoggedIn && study.nickname === nickname
  const pendingApplies = applies.filter(a => a.status === 'PENDING')

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

      <button
        onClick={() => navigate('/studies')}
        style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}
      >
        ← 목록으로
      </button>

      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '28px', marginBottom: '16px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
            background: study.status === 'OPEN' ? '#ECFDF5' : '#F3F4F6',
            color: study.status === 'OPEN' ? '#059669' : '#6B7280'
          }}>
            {study.status === 'OPEN' ? '모집 중' : '모집 마감'}
          </span>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            {study.currentMembers}/{study.maxMembers}명
          </span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{study.title}</h1>

        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>
          <span>{study.nickname}</span>
          <span>{formatDate(study.createdAt)}</span>
          {study.deadline && <span>마감일: {formatDate(study.deadline)}</span>}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', marginBottom: '20px' }} />

        <div style={{ fontSize: '15px', color: '#374151', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
          {study.description}
        </div>

        {study.techStacks && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>기술 스택</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {study.techStacks.split(',').map(stack => (
                <span key={stack} style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                  background: '#EEF2FF', color: '#4338CA'
                }}>
                  {stack.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!isOwner && (
            <button
              onClick={handleApply}
              disabled={applying || study.status === 'CLOSED'}
              style={{
                padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                background: study.status === 'OPEN' ? '#4338CA' : '#9CA3AF',
                color: '#fff', border: 'none', cursor: study.status === 'OPEN' ? 'pointer' : 'not-allowed'
              }}
            >
              {applying ? '지원 중...' : study.status === 'OPEN' ? '지원하기' : '모집 마감'}
            </button>
          )}

          {isOwner && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {study.status === 'OPEN' && (
                <button onClick={handleClose} style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', background: '#FEF3C7', color: '#92400E', border: 'none', cursor: 'pointer' }}>
                  모집 마감
                </button>
              )}
              <button onClick={() => navigate(`/studies/${studyId}/edit`)} style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', background: '#F3F4F6', color: '#374151', border: 'none', cursor: 'pointer' }}>
                수정
              </button>
              <button onClick={handleDelete} style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', background: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}>
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 지원자 목록 (소유자만) */}
      {isOwner && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
            지원자 목록 {pendingApplies.length > 0 && <span style={{ color: '#4338CA' }}>({pendingApplies.length})</span>}
          </h3>
          {applies.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {applies.map(apply => (
                <div key={apply.studyApplyId} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '8px', background: '#F9FAFB'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: '#EEF2FF', color: '#4338CA',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 600
                    }}>
                      {apply.nickname?.charAt(0)}
                    </div>
                    <span style={{ fontSize: '14px', color: '#111827' }}>{apply.nickname}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {apply.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAccept(apply.studyApplyId)}
                          style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '13px', background: '#ECFDF5', color: '#059669', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                        >
                          수락
                        </button>
                        <button
                          onClick={() => handleReject(apply.studyApplyId)}
                          style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '13px', background: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                        >
                          거절
                        </button>
                      </>
                    )}
                    {apply.status === 'ACCEPTED' && (
                      <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>수락됨</span>
                    )}
                    {apply.status === 'REJECTED' && (
                      <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 600 }}>거절됨</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: '14px' }}>
              아직 지원자가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StudyDetailPage