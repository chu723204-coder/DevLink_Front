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

function PostCard({
  postId, title, content, category,
  nickname, createdAt, commentCount, likeCount, viewCount, tags = []
}: PostCardProps) {
  const navigate = useNavigate()
  const cat = categoryColors[category] || categoryColors['FREE']

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
        border: '0.5px solid rgba(0,0,0,0.1)',
        borderRadius: '12px',
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'all 0.15s'
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
      {/* 상단: 카테고리 뱃지 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 600,
          background: cat.bg,
          color: cat.color
        }}>
          {cat.label}
        </span>
      </div>

      {/* 제목 */}
      <div style={{
        fontSize: '15px',
        fontWeight: 600,
        color: '#111827',
        marginBottom: '6px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {title}
      </div>

      {/* 내용 미리보기 */}
      <div style={{
        fontSize: '13px',
        color: '#6B7280',
        marginBottom: '12px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        lineHeight: '1.5'
      }}>
        {content}
      </div>

      {/* 태그 */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '11px',
              background: '#F3F4F6',
              color: '#6B7280'
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 하단: 작성자 / 날짜 / 통계 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%',
            background: '#EEF2FF', color: '#4338CA',
            fontSize: '10px', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {nickname?.charAt(0)}
          </div>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>{nickname}</span>
          <span style={{ fontSize: '12px', color: '#D1D5DB' }}>·</span>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{formatDate(createdAt)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>댓글 {commentCount}</span>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>좋아요 {likeCount}</span>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>조회 {viewCount}</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard