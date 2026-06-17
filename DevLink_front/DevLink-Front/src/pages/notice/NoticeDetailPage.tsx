import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../service/api'

interface Notice {
  noticeId: number
  title: string
  content: string
  nickname: string
  createdAt: string
  updatedAt: string
}

function NoticeDetailPage() {
  const { noticeId } = useParams<{ noticeId: string }>()
  const navigate = useNavigate()
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/notices/${noticeId}`)
        setNotice(res.data.data)
      } catch (e) {
        console.error('공지사항 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchNotice()
  }, [noticeId])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  if (loading) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ width: '80px', height: '16px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '20px' }} />
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '32px' }}>
        <div style={{ width: '60%', height: '28px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ width: '30%', height: '14px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '24px' }} />
        <div style={{ width: '100%', height: '14px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '90%', height: '14px', background: '#F9FAFB', borderRadius: '4px' }} />
      </div>
    </div>
  )

  if (!notice) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
      <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '20px' }}>
        공지사항을 찾을 수 없어요
      </div>
      <button
        onClick={() => navigate('/notices')}
        style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', background: '#4338CA', border: 'none', cursor: 'pointer' }}
      >
        목록으로
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

      {/* 뒤로가기 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/notices')}
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

      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6', padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* 공지 뱃지 */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
            background: '#EEF2FF', color: '#4338CA', display: 'inline-block'
          }}>
            📢 공지
          </span>
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: '24px', fontWeight: 700, color: '#111827',
          marginBottom: '16px', lineHeight: '1.4', letterSpacing: '-0.3px'
        }}>
          {notice.title}
        </h1>

        {/* 작성자/날짜 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#EEF2FF', color: '#4338CA',
            fontSize: '12px', fontWeight: 700, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            관
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{notice.nickname}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{formatDate(notice.createdAt)}</div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', marginBottom: '28px' }} />

        {/* 내용 */}
        <div style={{
          fontSize: '15px', color: '#374151',
          lineHeight: '1.9', whiteSpace: 'pre-wrap'
        }}>
          {notice.content}
        </div>
      </div>
    </div>
  )
}

export default NoticeDetailPage