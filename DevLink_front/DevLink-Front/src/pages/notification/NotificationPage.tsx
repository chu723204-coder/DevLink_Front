import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '../../store/notificationStore'
import api from '../../service/api'

interface Notification {
  notificationId: number
  type: string
  content: string
  isRead: boolean
  targetUrl: string
  createdAt: string
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
          알림 {unreadCount > 0 && <span style={{ fontSize: '14px', color: '#4338CA' }}>({unreadCount})</span>}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            style={{ fontSize: '13px', color: '#4338CA', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            전체 읽음
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>로딩 중...</div>
      ) : notifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map(notification => (
            <div
              key={notification.notificationId}
              onClick={() => handleClickNotification(notification)}
              style={{
                background: notification.isRead ? '#fff' : '#EEF2FF',
                borderRadius: '12px',
                border: '0.5px solid rgba(0,0,0,0.1)',
                padding: '16px 20px',
                cursor: notification.targetUrl ? 'pointer' : 'default',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#111827', marginBottom: '4px' }}>
                    {notification.content}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    {formatDate(notification.createdAt)}
                  </div>
                </div>
                {!notification.isRead && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4338CA', marginLeft: '12px', marginTop: '4px', flexShrink: 0 }} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
          알림이 없습니다
        </div>
      )}
    </div>
  )
}

export default NotificationPage