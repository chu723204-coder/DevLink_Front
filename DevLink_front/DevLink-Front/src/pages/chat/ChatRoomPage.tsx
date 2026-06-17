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
  const [ready, setReady] = useState(false) // ✅ 스크롤 완료 후 화면 표시용
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

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

  // ✅ 로딩 완료 후 스크롤 먼저 → 그 다음 화면 표시
  useEffect(() => {
    if (!loading) {
      // 스크롤 먼저
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
      // 스크롤 완료 후 화면 표시
      setTimeout(() => setReady(true), 50)
    }
  }, [loading])

  // ✅ 새 메시지 수신 시 부드럽게 스크롤
  useEffect(() => {
    if (messages.length > 0 && !loading && ready) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
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
    <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>

      {/* 헤더 */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid #F3F4F6',
        background: '#fff', display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <button
          onClick={() => navigate('/chat')}
          style={{
            background: 'none', border: 'none', color: '#6B7280',
            cursor: 'pointer', fontSize: '16px', padding: '4px 8px',
            borderRadius: '6px', transition: 'all 0.15s'
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
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
            {roomName || '채팅방'}
          </div>
          <div style={{ fontSize: '11px', color: connected ? '#10B981' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: connected ? '#10B981' : '#D1D5DB'
            }} />
            {connected ? '연결됨' : '연결 중...'}
          </div>
        </div>
        <button
          onClick={handleLeave}
          style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            color: '#DC2626', cursor: 'pointer', fontSize: '12px',
            padding: '6px 14px', borderRadius: '8px', fontWeight: 600,
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
          onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
        >
          나가기
        </button>
      </div>

      {/* ✅ 메시지 목록 - 스크롤 완료 전까지 invisible */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '20px',
          background: '#F9FAFB', display: 'flex', flexDirection: 'column',
          opacity: loading ? 1 : ready ? 1 : 0, // ✅ 스크롤 완료 전 숨김
          transition: 'opacity 0.15s'
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: '8px', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                {i % 2 !== 0 && <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E5E7EB', flexShrink: 0 }} />}
                <div style={{ width: '180px', height: '40px', background: '#E5E7EB', borderRadius: '12px' }} />
              </div>
            ))}
          </div>
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
          <div style={{ textAlign: 'center', margin: 'auto', color: '#9CA3AF' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
              아직 메시지가 없어요
            </div>
            <div style={{ fontSize: '12px' }}>첫 메시지를 보내보세요!</div>
          </div>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput onSend={handleSend} disabled={!connected} />
    </div>
  )
}

export default ChatRoomPage