import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../service/api'

interface Notice {
  noticeId: number
  title: string
  content: string
  nickname: string
  createdAt: string
}

function NoticeListPage() {
  const navigate = useNavigate()
  const { role } = useAuthStore()
  const isAdmin = role === 'ROLE_ADMIN'
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/notices')
        setNotices(res.data.data || [])
      } catch (e) {
        console.error('공지사항 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  const handleDelete = async (e: React.MouseEvent, noticeId: number) => {
    e.stopPropagation()
    if (!window.confirm('공지사항을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/api/notices/${noticeId}`)
      setNotices(prev => prev.filter(n => n.noticeId !== noticeId))
    } catch (e) {
      console.error('삭제 실패', e)
      alert('삭제에 실패했습니다.')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 60px' }}>

      {/* 헤더 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
            📢 공지사항
          </h1>
          {!loading && (
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
              총 {notices.length}개의 공지사항
            </p>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate('/notices/write')}
            style={{
              padding: '8px 18px', borderRadius: '8px', fontSize: '13px',
              background: '#4338CA', color: '#fff', border: 'none',
              cursor: 'pointer', fontWeight: 600,
              boxShadow: '0 1px 3px rgba(67,56,202,0.3)',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
            onMouseLeave={e => e.currentTarget.style.background = '#4338CA'}
          >
            + 공지 작성
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#fff', borderRadius: '12px',
              border: '1px solid #F3F4F6', padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ width: '60%', height: '16px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '10px' }} />
              <div style={{ width: '25%', height: '12px', background: '#F9FAFB', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notices.map((notice, index) => (
            <div
              key={notice.noticeId}
              onClick={() => navigate(`/notices/${notice.noticeId}`)}
              style={{
                background: '#fff', borderRadius: '12px',
                border: '1px solid #F3F4F6', padding: '20px 24px',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', gap: '16px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#C7D2FE'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(67,56,202,0.1)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#F3F4F6'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#EEF2FF', color: '#4338CA',
                fontSize: '13px', fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {notices.length - index}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '15px', fontWeight: 600, color: '#111827',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  marginBottom: '4px'
                }}>
                  {notice.title}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', gap: '8px' }}>
                  <span>{notice.nickname}</span>
                  <span>·</span>
                  <span>{formatDate(notice.createdAt)}</span>
                </div>
              </div>

              {/* 관리자 수정/삭제 버튼 */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/notices/${notice.noticeId}/edit`) }}
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
                  <button
                    onClick={e => handleDelete(e, notice.noticeId)}
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
              )}

              {!isAdmin && <span style={{ fontSize: '12px', color: '#9CA3AF', flexShrink: 0 }}>→</span>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          background: '#fff', borderRadius: '16px', border: '1px solid #F3F4F6'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📢</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            등록된 공지사항이 없어요
          </div>
          <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
            새로운 공지사항이 등록되면 알려드릴게요
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticeListPage