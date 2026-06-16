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

const categoryLabels: Record<string, string> = {
  FREE: '자유',
  INTERVIEW: '면접후기',
  TECH: '기술질문',
  JOB: '취업정보',
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
    <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>로딩 중...</div>
  )

  if (!post) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>게시글을 찾을 수 없습니다.</div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

      {/* 뒤로가기 */}
      <button
        onClick={() => navigate('/posts')}
        style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}
      >
        ← 목록으로
      </button>

      {/* 게시글 본문 */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '28px' }}>

        {/* 카테고리 + 제목 */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            background: '#EEF2FF', color: '#4338CA', marginBottom: '8px', display: 'inline-block'
          }}>
            {categoryLabels[post.category] || post.category}
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginTop: '8px' }}>{post.title}</h1>
        </div>

        {/* 작성자 정보 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#EEF2FF', color: '#4338CA',
              fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {post.nickname?.charAt(0)}
            </div>
            <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{post.nickname}</span>
            <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{formatDate(post.createdAt)}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#9CA3AF' }}>
            <span>조회 {post.viewCount}</span>
            <span>좋아요 {post.likeCount}</span>
            <span>댓글 {post.commentCount}</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', marginBottom: '20px' }} />

        {/* 내용 */}
        <div style={{ fontSize: '15px', color: '#374151', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
          {post.content}
        </div>

        {/* 좋아요 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <button
            onClick={handleLike}
            style={{
              padding: '8px 24px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer',
              background: liked ? '#4338CA' : '#fff',
              color: liked ? '#fff' : '#4338CA',
              border: '1px solid #4338CA', fontWeight: 500
            }}
          >
            👍 좋아요 {post.likeCount}
          </button>
        </div>

        {/* 수정/삭제 버튼 (본인 게시글만) */}
        {isLoggedIn && post.nickname === nickname && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => navigate(`/posts/${postId}/edit`)}
              style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                background: '#F3F4F6', color: '#374151', border: 'none', cursor: 'pointer'
              }}
            >
              수정
            </button>
            <button
              onClick={handlePostDelete}
              style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                background: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer'
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div style={{ marginTop: '24px', background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
          댓글 {post.commentCount}개
        </h3>

        {/* 댓글 입력 */}
        {isLoggedIn && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
              placeholder="댓글을 입력하세요..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '8px',
                border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none'
              }}
            />
            <button
              onClick={handleCommentSubmit}
              style={{
                padding: '10px 18px', borderRadius: '8px', fontSize: '14px',
                background: '#4338CA', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500
              }}
            >
              등록
            </button>
          </div>
        )}

        {/* 댓글 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {comments.length > 0 ? comments.map(comment => (
            <div key={comment.commentId} style={{
              padding: '12px 16px', borderRadius: '8px', background: '#F9FAFB',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    {comment.nickname || '알 수 없음'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{formatDate(comment.createdAt)}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#4B5563' }}>{comment.content}</div>
              </div>
              {isLoggedIn && comment.userId === userId && (
                <button
                  onClick={() => handleCommentDelete(comment.commentId)}
                  style={{
                    background: 'none', border: 'none', color: '#9CA3AF',
                    fontSize: '12px', cursor: 'pointer', marginLeft: '8px'
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: '14px' }}>
              첫 댓글을 남겨보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage