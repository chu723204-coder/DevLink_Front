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

const categoryLabels: Record<string, string> = {
  FREE: '자유게시판',
  INTERVIEW: '면접후기',
  TECH: '기술질문',
  JOB: '취업정보'
}

const sortOptions = [
  { value: 'latest', label: '최신' },
  { value: 'popular', label: '인기' },
  { value: 'comment', label: '댓글' },
]

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
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 60px', display: 'flex', gap: '24px' }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0 }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {category ? categoryLabels[category] : '전체 게시글'}
            </h1>
            {!loading && (
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
                총 {sortedPosts.length}개의 게시글
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex',
              background: '#F3F4F6',
              borderRadius: '8px',
              padding: '3px',
              gap: '2px'
            }}>
              {sortOptions.map(sort => (
                <button
                  key={sort.value}
                  onClick={() => setSortBy(sort.value as typeof sortBy)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: sortBy === sort.value ? 600 : 400,
                    color: sortBy === sort.value ? '#4338CA' : '#6B7280',
                    background: sortBy === sort.value ? '#fff' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: sortBy === sort.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {sort.label}
                </button>
              ))}
            </div>

            {isLoggedIn && (
              <button
                onClick={() => navigate('/posts/write')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#fff',
                  background: '#4338CA',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(67,56,202,0.3)',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
                onMouseLeave={e => e.currentTarget.style.background = '#4338CA'}
              >
                ✏️ 글쓰기
              </button>
            )}
          </div>
        </div>

        {/* 게시글 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  background: '#fff',
                  border: '1px solid #F3F4F6',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ width: '60px', height: '20px', background: '#F3F4F6', borderRadius: '20px', marginBottom: '12px' }} />
                  <div style={{ width: '70%', height: '18px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '10px' }} />
                  <div style={{ width: '100%', height: '14px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '6px' }} />
                  <div style={{ width: '80%', height: '14px', background: '#F9FAFB', borderRadius: '4px', marginBottom: '16px' }} />
                  <div style={{ width: '40%', height: '12px', background: '#F9FAFB', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          ) : sortedPosts.length > 0 ? (
            sortedPosts.map(post => (
              <PostCard key={post.postId} {...post} />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '64px 24px',
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #F3F4F6'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                아직 게시글이 없어요
              </div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>
                첫 번째 게시글을 작성해보세요!
              </div>
              {isLoggedIn && (
                <button
                  onClick={() => navigate('/posts/write')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
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
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}

export default PostListPage