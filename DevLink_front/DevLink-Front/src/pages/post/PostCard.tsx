import { useNavigate } from 'react-router-dom'

interface PostCardProps {
  postId: number
  title: string
  content: string
  category: string
  nickname: string
  createdAt: string
  commentCount: number
  likeCount: number
  viewCount: number
  tags?: string[]
}

const categoryColors: Record<string, { bg: string; color: string; label: string }> = {
  FREE:      { bg: '#EEF2FF', color: '#4338CA', label: '자유' },
  INTERVIEW: { bg: '#FDF2F8', color: '#9D174D', label: '면접후기' },
  TECH:      { bg: '#F0FDF4', color: '#166534', label: '기술질문' },
  JOB:       { bg: '#FFFBEB', color: '#92400E', label: '취업정보' },
}

// ✅ 닉네임 첫 글자 기반 아바타 색상 다양화
const avatarColors = [
  { bg: '#EEF2FF', color: '#4338CA' },
  { bg: '#FDF2F8', color: '#9D174D' },
  { bg: '#F0FDF4', color: '#166534' },
  { bg: '#FFFBEB', color: '#92400E' },
  { bg: '#F0F9FF', color: '#0369A1' },
  { bg: '#FFF7ED', color: '#C2410C' },
]

function getAvatarColor(nickname: string) {
  const index = (nickname?.charCodeAt(0) || 0) % avatarColors.length
  return avatarColors[index]
}

function PostCard({
  postId, title, content, category,
  nickname, createdAt, commentCount, likeCount, viewCount, tags = []
}: PostCardProps) {
  const navigate = useNavigate()
  const cat = categoryColors[category] || categoryColors['FREE']
  const avatar = getAvatarColor(nickname)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    return `${Math.floor(diff / 86400)}일 전`
  }

  return (
    <div
      onClick={() => navigate(`/posts/${postId}`)}
      style={{
        background: '#fff',
        border: '1px solid #F3F4F6',
        borderRadius: '12px',
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#C7D2FE'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(67,56,202,0.1)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#F3F4F6'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* 상단: 카테고리 뱃지 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{
          padding: '3px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 600,
          background: cat.bg,
          color: cat.color,
          letterSpacing: '0.02em'
        }}>
          {cat.label}
        </span>
      </div>

      {/* 제목 */}
      <div style={{
        fontSize: '15px',
        fontWeight: 700,
        color: '#111827',
        marginBottom: '8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lineHeight: '1.4'
      }}>
        {title}
      </div>

      {/* 내용 미리보기 */}
      <div style={{
        fontSize: '13px',
        color: '#6B7280',
        marginBottom: '14px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        lineHeight: '1.6'
      }}>
        {content}
      </div>

      {/* 태그 */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              background: '#F3F4F6',
              color: '#6B7280',
              fontWeight: 500
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 구분선 */}
      <div style={{ borderTop: '1px solid #F9FAFB', marginBottom: '12px' }} />

      {/* 하단: 작성자 / 날짜 / 통계 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* ✅ 다양한 색상 아바타 */}
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: avatar.bg, color: avatar.color,
            fontSize: '11px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            {nickname?.charAt(0)}
          </div>
          <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>{nickname}</span>
          <span style={{ fontSize: '12px', color: '#D1D5DB' }}>·</span>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{formatDate(createdAt)}</span>
        </div>

        {/* ✅ 아이콘 추가된 통계 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '3px' }}>
            💬 {commentCount}
          </span>
          <span style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '3px' }}>
            🔥 {likeCount}
          </span>
          <span style={{ fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '3px' }}>
            👁 {viewCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PostCard