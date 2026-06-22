import { useState } from 'react'

interface ChatInputProps {
  onSend: (content: string) => void
}

function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div style={{
      display: 'flex', gap: '8px', padding: '16px',
      borderTop: '0.5px solid rgba(0,0,0,0.1)',
      background: '#fff'
    }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
        placeholder="메시지를 입력하세요..."
        style={{
          flex: 1, padding: '10px 14px', borderRadius: '8px',
          border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
          background: '#fff'
        }}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim()}
        style={{
          padding: '10px 18px', borderRadius: '8px', fontSize: '14px',
          background: !input.trim() ? '#E5E7EB' : '#4338CA',
          color: !input.trim() ? '#9CA3AF' : '#fff',
          border: 'none', cursor: !input.trim() ? 'not-allowed' : 'pointer',
          fontWeight: 500, flexShrink: 0
        }}
      >
        전송
      </button>
    </div>
  )
}

export default ChatInput