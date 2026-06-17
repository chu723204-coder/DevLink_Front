import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../service/api'

interface ChatRoom {
  roomId: number
  roomName: string
  studyId: number
}

const roomColors = [
  { bg: '#EEF2FF', color: '#4338CA' },
  { bg: '#FDF2F8', color: '#9D174D' },
  { bg: '#F0FDF4', color: '#166534' },
  { bg: '#FFFBEB', color: '#92400E' },
  { bg: '#F0F9FF', color: '#0369A1' },
  { bg: '#FFF7ED', color: '#C2410C' },
]

function getRoomColor(name: string) {
  const index = (name?.charCodeAt(0) || 0) % roomColors.length
  return roomColors[index]
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
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>

      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>채팅</h1>
        {!loading && (
          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
            참여 중인 채팅방 {rooms.length}개
          </p>
        )}
      </div>

      {loading ? (
        // ✅ 로딩 스켈레톤
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#fff', borderRadius: '12px',
              border: '1px solid #F3F4F6', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F3F4F6', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: '40%', height: '14px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ width: '25%', height: '12px', background: '#F9FAFB', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rooms.map(room => {
            const color = getRoomColor(room.roomName)
            return (
              <div
                key={room.roomId}
                onClick={() => navigate(`/chat/${room.roomId}`)}
                style={{
                  background: '#fff', borderRadius: '12px',
                  border: '1px solid #F3F4F6', padding: '16px 20px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* ✅ 다양한 색상 아바타 */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: color.bg, color: color.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', fontWeight: 700, flexShrink: 0
                  }}>
                    {room.roomName?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      {room.roomName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      💬 스터디 채팅방
                    </div>
                  </div>
                </div>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: '#F3F4F6', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', color: '#9CA3AF', transition: 'all 0.15s'
                }}>
                  →
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // ✅ 빈 상태 개선
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          background: '#fff', borderRadius: '16px',
          border: '1px solid #F3F4F6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            참여 중인 채팅방이 없어요
          </div>
          <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
            스터디에 참여하면 채팅방이 자동으로 생성돼요
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatListPage