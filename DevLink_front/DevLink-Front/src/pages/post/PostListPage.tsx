import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar'
import RightSidebar from '../../components/layout/RightSidebar'
import { useAuthStore } from '../../store/useAuthStore'
import PostCard from './PostCard'
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

function PostListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuthStore()
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'comment'>('latest')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const category = new URLSearchParams(location.search).get('category') || ''

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const params = category ? { category } : {}
        const res = await api.get('/api/posts', { params })
        setPosts(res.data.data || [])
      } catch (e) {
        console.error('게시글 목록 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [category])

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'popular') return b.likeCount - a.likeCount
    if (sortBy === 'comment') return b.commentCount - a.commentCount
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px' }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
            {category ? {
              FREE: '자유게시판',
              INTERVIEW: '면접후기',
              TECH: '기술질문',
              JOB: '취업정보'
            }[category] : '전체 게시글'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {['latest', 'popular', 'comment'].map(sort => (
              <button
                key={sort}
                onClick={() => setSortBy(sort as typeof sortBy)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: sortBy === sort ? 600 : 400,
                  color: sortBy === sort ? '#4338CA' : '#6B7280',
                  background: sortBy === sort ? '#EEF2FF' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {sort === 'latest' ? '최신' : sort === 'popular' ? '인기' : '댓글'}
              </button>
            ))}
            {isLoggedIn && (
              <button
                onClick={() => navigate('/posts/write')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#fff',
                  background: '#4338CA',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                글쓰기
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
              로딩 중...
            </div>
          ) : sortedPosts.length > 0 ? (
            sortedPosts.map(post => (
              <PostCard key={post.postId} {...post} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
              게시글이 없습니다
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}

export default PostListPage