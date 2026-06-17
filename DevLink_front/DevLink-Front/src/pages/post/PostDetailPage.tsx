import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../service/api'

interface Post {
  postId: number
  title: string
  content: string
  category: string
  nickname: string
  createdAt: string
  commentCount: number
  likeCount: number
  viewCount: number
}

interface Comment {
  commentId: number
  userId: number
  nickname?: string
  content: string
  createdAt: string
}

const categoryColors: Record<string, { bg: string; color: string; label: string }> = {
  FREE:      { bg: '#EEF2FF', color: '#4338CA', label: '자유' },
  INTERVIEW: { bg: '#FDF2F8', color: '#9D174D', label: '면접후기' },
  TECH:      { bg: '#F0FDF4', color: '#166534', label: '기술질문' },
  JOB:       { bg: '#FFFBEB', color: '#92400E', label: '취업정보' },
}

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

function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { isLoggedIn, userId, nickname } = useAuthStore()

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [postRes, commentRes] = await Promise.all([
          api.get(`/api/posts/${postId}`),
          api.get(`/api/posts/${postId}/comments`)
        ])
        setPost(postRes.data.data)
        setComments(commentRes.data.data || [])
      } catch (e) {
        console.error('데이터 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [postId])

  const handleLike = async () => {
    if (!isLoggedIn) return alert('로그인이 필요합니다.')
    try {
      await api.post(`/api/posts/${postId}/like`)
      setPost(prev => prev ? {
        ...prev,
        likeCount: liked ? prev.likeCount - 1 : prev.likeCount + 1
      } : prev)
      setLiked(!liked)
    } catch (e) {
      console.error('좋아요 실패', e)
    }
  }

  const handleCommentSubmit = async () => {
    if (!isLoggedIn) return alert('로그인이 필요합니다.')
    if (!commentInput.trim()) return
    try {
      const res = await api.post(`/api/posts/${postId}/comments`, null, {
        params: { content: commentInput }
      })
      setComments(prev => [...prev, { ...res.data.data, nickname }])
      setCommentInput('')
      setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev)
    } catch (e) {
      console.error('댓글 작성 실패', e)
    }
  }

  const handleCommentDelete = async (commentId: number) => {
    try {
      await api.delete(`/api/posts/comments/${commentId}`)
      setComments(prev => prev.filter(c => c.commentId !== commentId))
      setPost(prev => prev ? { ...prev, commentCount: prev.commentCount - 1 } : prev)
    } catch (e) {
      console.error('댓글 삭제 실패', e)
    }
  }

  const handlePostDelete = async () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/api/posts/${postId}`)
      navigate('/posts')
    } catch (e) {
      console.error('게시글 삭제 실패', e)
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

  if (loading) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ width: '80px', height: '16px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '20px' }} />
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #F3F4F6', padding: '28px' }}>
        <div style={{ width: '60px', height: '20px', background: '#F3F4F6', borderRadius: '20px', marginBottom: '12px' }} />
        <div style={{ width: '60%', height: '28px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '20px' }} />
        <div style={{ width: '100%', height: '1px', background: '#F3F4F6', marginBottom: '20px' }} />
        <div style={{ width: '100%', height: '14px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '90%', height: '14px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '80%', height: '14px', background: '#F9FAFB', borderRadius: '4px' }} />
      </div>
    </div>
  )

  if (!post) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
      <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>게시글을 찾을 수 없어요</div>
      <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>삭제되었거나 존재하지 않는 게시글이에요</div>
      <button
        onClick={() => navigate('/posts')}
        style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', background: '#4338CA', border: 'none', cursor: 'pointer' }}
      >
        목록으로
      </button>
    </div>
  )

  const cat = categoryColors[post.category] || categoryColors['FREE']
  const avatar = getAvatarColor(post.nickname)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

      {/* ✅ 뒤로가기 - 단독 줄로 분리 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/posts')}
          style={{
            background: 'none', border: 'none', color: '#6B7280',
            cursor: 'pointer', fontSize: '13px', padding: '6px 10px',
            borderRadius: '6px', transition: 'all 0.15s', display: 'block'
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
          ← 목록으로
        </button>
      </div>

      {/* 게시글 본문 */}
      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6', padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
            background: cat.bg, color: cat.color, display: 'inline-block'
          }}>
            {cat.label}
          </span>
        </div>

        <h1 style={{
          fontSize: '24px', fontWeight: 700, color: '#111827',
          marginBottom: '20px', lineHeight: '1.4', letterSpacing: '-0.3px'
        }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: avatar.bg, color: avatar.color,
              fontSize: '13px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {post.nickname?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{post.nickname}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{formatDate(post.createdAt)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9CA3AF' }}>
              <span>👁 {post.viewCount}</span>
              <span>🔥 {post.likeCount}</span>
              <span>💬 {post.commentCount}</span>
            </div>
            {isLoggedIn && post.nickname === nickname && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => navigate(`/posts/${postId}/edit`)}
                  style={{
                    padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
                    background: '#F9FAFB', color: '#374151',
                    border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}
                >
                  수정
                </button>
                <button
                  onClick={handlePostDelete}
                  style={{
                    padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
                    background: '#FEF2F2', color: '#DC2626',
                    border: '1px solid #FECACA', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', marginBottom: '28px' }} />

        <div style={{
          fontSize: '15px', color: '#374151',
          lineHeight: '1.9', whiteSpace: 'pre-wrap', marginBottom: '32px'
        }}>
          {post.content}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleLike}
            style={{
              padding: '10px 32px', borderRadius: '24px', fontSize: '14px',
              cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
              background: liked ? '#4338CA' : '#fff',
              color: liked ? '#fff' : '#4338CA',
              border: `2px solid ${liked ? '#4338CA' : '#C7D2FE'}`,
              boxShadow: liked ? '0 4px 12px rgba(67,56,202,0.3)' : 'none',
              transform: liked ? 'scale(1.03)' : 'scale(1)'
            }}
            onMouseEnter={e => {
              if (!liked) {
                e.currentTarget.style.background = '#EEF2FF'
                e.currentTarget.style.borderColor = '#4338CA'
              }
            }}
            onMouseLeave={e => {
              if (!liked) {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.borderColor = '#C7D2FE'
              }
            }}
          >
            🔥 좋아요 {post.likeCount}
          </button>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div style={{
        marginTop: '16px', background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6', padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{
          fontSize: '15px', fontWeight: 700, color: '#111827',
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          💬 댓글 <span style={{ color: '#4338CA' }}>{post.commentCount}</span>
        </h3>

        {isLoggedIn ? (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <input
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
              placeholder="댓글을 입력하세요..."
              style={{
                flex: 1, padding: '11px 16px', borderRadius: '10px',
                border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.15s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
              onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
            />
            <button
              onClick={handleCommentSubmit}
              style={{
                padding: '11px 20px', borderRadius: '10px', fontSize: '14px',
                background: '#4338CA', color: '#fff', border: 'none',
                cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
                boxShadow: '0 1px 3px rgba(67,56,202,0.3)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
              onMouseLeave={e => e.currentTarget.style.background = '#4338CA'}
            >
              등록
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: '14px 16px', borderRadius: '10px', background: '#F9FAFB',
              border: '1px solid #F3F4F6', fontSize: '13px', color: '#9CA3AF',
              textAlign: 'center', marginBottom: '24px', cursor: 'pointer'
            }}
            onClick={() => alert('로그인이 필요합니다.')}
          >
            로그인 후 댓글을 남길 수 있어요
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {comments.length > 0 ? comments.map(comment => {
            const commentAvatar = getAvatarColor(comment.nickname || '')
            return (
              <div key={comment.commentId} style={{
                padding: '14px 16px', borderRadius: '10px',
                background: '#F9FAFB', border: '1px solid #F3F4F6',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                transition: 'border-color 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#F3F4F6'}
              >
                <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: commentAvatar.bg, color: commentAvatar.color,
                    fontSize: '11px', fontWeight: 700, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {(comment.nickname || '?').charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {comment.nickname || '알 수 없음'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                      {comment.content}
                    </div>
                  </div>
                </div>
                {isLoggedIn && comment.userId === userId && (
                  <button
                    onClick={() => handleCommentDelete(comment.commentId)}
                    style={{
                      background: 'none', border: 'none', color: '#D1D5DB',
                      fontSize: '12px', cursor: 'pointer', marginLeft: '12px',
                      padding: '4px 8px', borderRadius: '4px', transition: 'all 0.15s', flexShrink: 0
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#DC2626'
                      e.currentTarget.style.background = '#FEF2F2'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#D1D5DB'
                      e.currentTarget.style.background = 'none'
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
            )
          }) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
              <div style={{ fontSize: '14px' }}>첫 댓글을 남겨보세요!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage