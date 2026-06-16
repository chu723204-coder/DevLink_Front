import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../service/api'

interface ChatRoom {
  roomId: number
  roomName: string
  studyId: number
}

function ChatListPage() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/chat/rooms/my')
        setRooms(res.data.data || [])
      } catch (e) {
        console.error('채팅방 목록 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>채팅</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>로딩 중...</div>
      ) : rooms.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rooms.map(room => (
            <div
              key={room.roomId}
              onClick={() => navigate(`/chat/${room.roomId}`)}
              style={{
                background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)',
                padding: '16px 20px', cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#EEF2FF', color: '#4338CA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 600
                }}>
                  {room.roomName?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{room.roomName}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>스터디 채팅방</div>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>→</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
          참여 중인 채팅방이 없습니다
        </div>
      )}
    </div>
  )
}

export default ChatListPage