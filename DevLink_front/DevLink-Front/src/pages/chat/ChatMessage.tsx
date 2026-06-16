interface MessageProps {
  content: string
  nickname: string
  createdAt: string
  isMine: boolean
}

function ChatMessage({ content, nickname, createdAt, isMine }: MessageProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMine ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: '8px',
      marginBottom: '12px'
    }}>
      {/* 아바타 (상대방만) */}
      {!isMine && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#EEF2FF', color: '#4338CA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 600, flexShrink: 0
        }}>
          {nickname?.charAt(0)}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
        {/* 닉네임 (상대방만) */}
        {!isMine && (
          <span style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>{nickname}</span>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', flexDirection: isMine ? 'row-reverse' : 'row' }}>
          {/* 말풍선 */}
          <div style={{
            padding: '10px 14px', borderRadius: isMine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            background: isMine ? '#4338CA' : '#F3F4F6',
            color: isMine ? '#fff' : '#111827',
            fontSize: '14px', lineHeight: '1.5', wordBreak: 'break-word'
          }}>
            {content}
          </div>

          {/* 시간 */}
          <span style={{ fontSize: '11px', color: '#9CA3AF', flexShrink: 0 }}>
            {formatTime(createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage