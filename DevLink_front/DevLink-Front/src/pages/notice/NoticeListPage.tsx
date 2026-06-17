import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 60px' }}>

      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
          📢 공지사항
        </h1>
        {!loading && (
          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
            총 {notices.length}개의 공지사항
          </p>
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
              {/* 번호 */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#EEF2FF', color: '#4338CA',
                fontSize: '13px', fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {notices.length - index}
              </div>

              {/* 내용 */}
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
              <span style={{ fontSize: '12px', color: '#9CA3AF', flexShrink: 0 }}>→</span>
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