import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

const categoryLabels: Record<string, string> = {
  FREE: '자유',
  INTERVIEW: '면접후기',
  TECH: '기술질문',
  JOB: '취업정보',
}

function MyPostsPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/users/me/posts')
        setPosts(res.data.data || [])
      } catch (e) {
        console.error('내 게시글 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchMyPosts()
  }, [])

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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/mypage')}
          style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}
        >
          ← 마이페이지
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>내 게시글</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>로딩 중...</div>
      ) : posts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {posts.map(post => (
            <div
              key={post.postId}
              onClick={() => navigate(`/posts/${post.postId}`)}
              style={{
                background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)',
                padding: '16px 20px', cursor: 'pointer', transition: 'all 0.15s'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                  background: '#EEF2FF', color: '#4338CA'
                }}>
                  {categoryLabels[post.category] || post.category}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                {post.title}
              </div>
              <div style={{
                fontSize: '13px', color: '#6B7280', marginBottom: '10px',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'
              }}>
                {post.content}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF' }}>
                <span>{formatDate(post.createdAt)}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span>댓글 {post.commentCount}</span>
                  <span>좋아요 {post.likeCount}</span>
                  <span>조회 {post.viewCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
          작성한 게시글이 없습니다
        </div>
      )}
    </div>
  )
}

export default MyPostsPage