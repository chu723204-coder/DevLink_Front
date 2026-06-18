import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '../../store/notificationStore'
import api from '../../service/api'

interface Notification {
  notificationId: number
  type: string
  message: string   // ✅ content → message
  isRead: boolean
  targetUrl: string
  createdAt: string
}

const typeIcon: Record<string, string> = {
  COMMENT: '💬',
  LIKE: '❤️',
  STUDY_APPLY: '✋',
  STUDY_ACCEPT: '✅',
  STUDY_REJECT: '❌',
}

function NotificationPage() {
  const navigate = useNavigate()
  const { resetUnread } = useNotificationStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/notifications')
        setNotifications(res.data.data || [])
      } catch (e) {
        console.error('알림 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const handleReadAll = async () => {
    try {
      await api.patch('/api/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      resetUnread()
    } catch (e) {
      console.error('전체 읽음 처리 실패', e)
    }
  }

  const handleClickNotification = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await api.patch(`/api/notifications/${notification.notificationId}/read`)
        setNotifications(prev =>
          prev.map(n => n.notificationId === notification.notificationId ? { ...n, isRead: true } : n)
        )
      } catch (e) {
        console.error('읽음 처리 실패', e)
      }
    }
    if (notification.targetUrl) {
      navigate(notification.targetUrl)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    return `${Math.floor(diff / 86400)}일 전`
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
            🔔 알림
          </h1>
          {!loading && (
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
              {unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : '모든 알림을 읽었어요'}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            style={{
              fontSize: '13px', color: '#4338CA', background: '#EEF2FF',
              border: '1px solid #C7D2FE', cursor: 'pointer',
              padding: '6px 14px', borderRadius: '8px', fontWeight: 600,
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}
          >
            전체 읽음
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#fff', borderRadius: '12px',
              border: '1px solid #F3F4F6', padding: '16px 20px',
              display: 'flex', gap: '12px', alignItems: 'center'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F3F4F6', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: '70%', height: '14px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ width: '30%', height: '12px', background: '#F9FAFB', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map(notification => (
            <div
              key={notification.notificationId}
              onClick={() => handleClickNotification(notification)}
              style={{
                background: notification.isRead ? '#fff' : '#EEF2FF',
                borderRadius: '12px',
                border: `1px solid ${notification.isRead ? '#F3F4F6' : '#C7D2FE'}`,
                padding: '16px 20px',
                cursor: notification.targetUrl ? 'pointer' : 'default',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                boxShadow: notification.isRead ? '0 1px 3px rgba(0,0,0,0.04)' : '0 1px 3px rgba(67,56,202,0.08)'
              }}
              onMouseEnter={e => {
                if (notification.targetUrl) {
                  e.currentTarget.style.borderColor = '#4338CA'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = notification.isRead ? '#F3F4F6' : '#C7D2FE'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: notification.isRead ? '#F3F4F6' : '#E0E7FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px'
              }}>
                {typeIcon[notification.type] || '🔔'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px', color: '#111827', marginBottom: '4px',
                  fontWeight: notification.isRead ? 400 : 600, lineHeight: '1.5'
                }}>
                  {notification.message}  {/* ✅ content → message */}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {formatDate(notification.createdAt)}
                </div>
              </div>

              {!notification.isRead && (
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#4338CA', flexShrink: 0, marginTop: '4px'
                }} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          background: '#fff', borderRadius: '16px',
          border: '1px solid #F3F4F6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            새로운 알림이 없어요
          </div>
          <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
            댓글, 스터디 지원 등 새 소식이 오면 알려드려요
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPage