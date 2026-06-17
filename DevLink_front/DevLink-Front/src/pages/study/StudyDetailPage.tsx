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

  // ✅ 로딩 스켈레톤
  if (loading) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ width: '80px', height: '16px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '20px' }} />
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '32px' }}>
        <div style={{ width: '60px', height: '22px', background: '#F3F4F6', borderRadius: '20px', marginBottom: '16px' }} />
        <div style={{ width: '50%', height: '28px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '12px' }} />
        <div style={{ width: '30%', height: '14px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '24px' }} />
        <div style={{ width: '100%', height: '14px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '90%', height: '14px', background: '#F9FAFB', borderRadius: '4px' }} />
      </div>
    </div>
  )

  if (!study) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
      <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>스터디를 찾을 수 없어요</div>
      <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>삭제되었거나 존재하지 않는 스터디예요</div>
      <button
        onClick={() => navigate('/studies')}
        style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', background: '#4338CA', border: 'none', cursor: 'pointer' }}
      >
        목록으로
      </button>
    </div>
  )

  const isOwner = isLoggedIn && study.nickname === nickname
  const pendingApplies = applies.filter(a => a.status === 'PENDING')
  const memberRatio = study.currentMembers / study.maxMembers
  const isFull = study.currentMembers >= study.maxMembers
  const avatar = getAvatarColor(study.nickname)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

      {/* ✅ 뒤로가기 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/studies')}
          style={{
            background: 'none', border: 'none', color: '#6B7280',
            cursor: 'pointer', fontSize: '13px', padding: '6px 10px',
            borderRadius: '6px', transition: 'all 0.15s', display: 'block'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F3F4F6'
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = '#6B7280'
          }}
        >
          ← 목록으로
        </button>
      </div>

      {/* ✅ 스터디 본문 */}
      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6', padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '16px'
      }}>
        {/* 상태 뱃지 + 인원 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{
            padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            background: study.status === 'OPEN' ? '#ECFDF5' : '#F3F4F6',
            color: study.status === 'OPEN' ? '#059669' : '#6B7280'
          }}>
            {study.status === 'OPEN' ? '🟢 모집 중' : '⛔ 모집 마감'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: isFull ? '#DC2626' : '#4338CA' }}>
            {study.currentMembers}/{study.maxMembers}명
          </span>
        </div>

        {/* 인원 진행바 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ width: '100%', height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: `${memberRatio * 100}%`, height: '100%', borderRadius: '2px',
              background: isFull ? '#DC2626' : '#4338CA', transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: '24px', fontWeight: 700, color: '#111827',
          marginBottom: '16px', lineHeight: '1.4', letterSpacing: '-0.3px'
        }}>
          {study.title}
        </h1>

        {/* 작성자 정보 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: avatar.bg, color: avatar.color,
              fontSize: '12px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {study.nickname?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{study.nickname}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{formatDate(study.createdAt)}</div>
            </div>
          </div>

          {/* 마감일 */}
          {study.deadline && (
            <div style={{
              padding: '6px 14px', borderRadius: '8px',
              background: '#FFF7ED', border: '1px solid #FED7AA',
              fontSize: '12px', color: '#C2410C', fontWeight: 600
            }}>
              📅 마감 {formatDate(study.deadline)}
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', marginBottom: '24px' }} />

        {/* 설명 */}
        <div style={{
          fontSize: '15px', color: '#374151',
          lineHeight: '1.9', whiteSpace: 'pre-wrap', marginBottom: '28px'
        }}>
          {study.description}
        </div>

        {/* 기술 스택 */}
        {study.techStacks && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>
              🛠 기술 스택
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {study.techStacks.split(',').map(stack => (
                <span key={stack} style={{
                  padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
                  background: '#EEF2FF', color: '#4338CA', fontWeight: 600
                }}>
                  {stack.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 버튼 영역 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {!isOwner && (
            <button
              onClick={handleApply}
              disabled={applying || study.status === 'CLOSED'}
              style={{
                padding: '10px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                background: study.status === 'OPEN' ? '#4338CA' : '#9CA3AF',
                color: '#fff', border: 'none',
                cursor: study.status === 'OPEN' ? 'pointer' : 'not-allowed',
                boxShadow: study.status === 'OPEN' ? '0 1px 3px rgba(67,56,202,0.3)' : 'none',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (study.status === 'OPEN') e.currentTarget.style.background = '#3730A3' }}
              onMouseLeave={e => { if (study.status === 'OPEN') e.currentTarget.style.background = '#4338CA' }}
            >
              {applying ? '지원 중...' : study.status === 'OPEN' ? '✋ 지원하기' : '모집 마감'}
            </button>
          )}

          {isOwner && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {study.status === 'OPEN' && (
                <button
                  onClick={handleClose}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                    background: '#FEF3C7', color: '#92400E',
                    border: '1px solid #FDE68A', cursor: 'pointer', fontWeight: 500,
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FDE68A'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FEF3C7'}
                >
                  모집 마감
                </button>
              )}
              <button
                onClick={() => navigate(`/studies/${studyId}/edit`)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                  background: '#F9FAFB', color: '#374151',
                  border: '1px solid #E5E7EB', cursor: 'pointer', fontWeight: 500,
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
                  background: '#FEF2F2', color: '#DC2626',
                  border: '1px solid #FECACA', cursor: 'pointer', fontWeight: 500,
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ 지원자 목록 (소유자만) */}
      {isOwner && (
        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #F3F4F6', padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{
            fontSize: '15px', fontWeight: 700, color: '#111827',
            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            👥 지원자 목록
            {pendingApplies.length > 0 && (
              <span style={{
                background: '#4338CA', color: '#fff',
                fontSize: '11px', fontWeight: 700,
                padding: '1px 7px', borderRadius: '10px'
              }}>
                {pendingApplies.length}
              </span>
            )}
          </h3>

          {applies.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {applies.map(apply => {
                const applyAvatar = getAvatarColor(apply.nickname)
                return (
                  <div key={apply.studyApplyId} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: '10px',
                    background: '#F9FAFB', border: '1px solid #F3F4F6',
                    transition: 'border-color 0.15s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#F3F4F6'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: applyAvatar.bg, color: applyAvatar.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, flexShrink: 0
                      }}>
                        {apply.nickname?.charAt(0)}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                        {apply.nickname}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {apply.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAccept(apply.studyApplyId)}
                            style={{
                              padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                              background: '#ECFDF5', color: '#059669',
                              border: '1px solid #A7F3D0', cursor: 'pointer', fontWeight: 600,
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#D1FAE5'}
                            onMouseLeave={e => e.currentTarget.style.background = '#ECFDF5'}
                          >
                            수락
                          </button>
                          <button
                            onClick={() => handleReject(apply.studyApplyId)}
                            style={{
                              padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                              background: '#FEF2F2', color: '#DC2626',
                              border: '1px solid #FECACA', cursor: 'pointer', fontWeight: 600,
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                            onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                          >
                            거절
                          </button>
                        </>
                      )}
                      {apply.status === 'ACCEPTED' && (
                        <span style={{
                          fontSize: '12px', color: '#059669', fontWeight: 700,
                          background: '#ECFDF5', padding: '4px 10px', borderRadius: '20px'
                        }}>
                          ✅ 수락됨
                        </span>
                      )}
                      {apply.status === 'REJECTED' && (
                        <span style={{
                          fontSize: '12px', color: '#DC2626', fontWeight: 700,
                          background: '#FEF2F2', padding: '4px 10px', borderRadius: '20px'
                        }}>
                          ❌ 거절됨
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontSize: '14px' }}>아직 지원자가 없어요</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StudyDetailPage