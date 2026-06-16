import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { connectStomp, disconnectStomp, sendMessage } from '../../service/chatService'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import api from '../../service/api'

interface Message {
  messageId: number
  chatRoomId: number
  senderId: number
  nickname: string
  content: string
  createdAt: string
}

function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { userId } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [roomName, setRoomName] = useState('')
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/chat/rooms/${roomId}/messages`)
        setMessages(res.data.data || [])
      } catch (e) {
        console.error('메시지 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }

    const fetchRoomInfo = async () => {
      try {
        const res = await api.get('/api/chat/rooms/my')
        const room = res.data.data?.find((r: any) => r.roomId === Number(roomId))
        if (room) setRoomName(room.roomName)
      } catch (e) {
        console.error('채팅방 정보 조회 실패', e)
      }
    }

    fetchMessages()
    fetchRoomInfo()

    connectStomp(Number(roomId), (message: Message) => {
      setMessages(prev => [...prev, message])
      setConnected(true)
    })

    const timer = setTimeout(() => setConnected(true), 1000)

    return () => {
      clearTimeout(timer)
      disconnectStomp()
      setConnected(false)
    }
  }, [roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (content: string) => {
    sendMessage(Number(roomId), content)
  }

  const handleLeave = async () => {
    if (!window.confirm('채팅방을 나가시겠습니까?')) return
    try {
      await api.delete(`/api/chat/rooms/${roomId}/members`)
      navigate('/chat')
    } catch (e) {
      console.error('채팅방 나가기 실패', e)
      alert('채팅방 나가기에 실패했습니다.')
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>

      {/* 헤더 */}
      <div style={{
        padding: '16px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.1)',
        background: '#fff', display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button
          onClick={() => navigate('/chat')}
          style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{roomName || '채팅방'}</div>
          <div style={{ fontSize: '12px', color: connected ? '#10B981' : '#9CA3AF' }}>
            {connected ? '연결됨' : '연결 중...'}
          </div>
        </div>
        <button
          onClick={handleLeave}
          style={{
            background: 'none', border: '1px solid #EF4444', color: '#EF4444',
            cursor: 'pointer', fontSize: '12px', padding: '6px 12px',
            borderRadius: '6px', fontWeight: 500
          }}
        >
          나가기
        </button>
      </div>

      {/* 메시지 목록 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: '#F9FAFB' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>로딩 중...</div>
        ) : messages.length > 0 ? (
          <>
            {messages.map(message => (
              <ChatMessage
                key={message.messageId}
                content={message.content}
                nickname={message.nickname}
                createdAt={message.createdAt}
                isMine={message.senderId === userId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
            첫 메시지를 보내보세요!
          </div>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput onSend={handleSend} disabled={!connected} />
    </div>
  )
}

export default ChatRoomPage