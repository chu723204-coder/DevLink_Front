import { useState, useEffect } from 'react'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

interface Post {
  postId: number
  title: string
  nickname: string
  category: string
  viewCount: number
  createdAt: string
}

function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error } = useToastStore()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/posts')
      setPosts(res.data.data || [])
    } catch (e) {
      console.error('게시글 목록 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: number, title: string) => {
    if (!window.confirm(`[${title}] 게시글을 강제 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return
    try {
      await api.delete(`/api/admin/posts/${postId}`)
      setPosts(prev => prev.filter(p => p.postId !== postId))
      success(`게시글이 삭제되었습니다.`)
    } catch (e) {
      console.error('게시글 삭제 실패', e)
      error('처리에 실패했습니다.')
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('ko-KR')

  const categoryLabel: Record<string, string> = {
    QUESTION: '질문',
    STUDY: '스터디',
    PROJECT: '프로젝트',
    FREE: '자유',
    CAREER: '취업',
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>
          📝 게시글 관리
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '6px 0 0 0' }}>
          총 {posts.length}개
        </p>
      </div>

      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 120px 80px 80px 120px 80px',
          padding: '12px 20px', background: '#F9FAFB',
          borderBottom: '1px solid #F3F4F6',
          fontSize: '12px', fontWeight: 600, color: '#6B7280'
        }}>
          <div>ID</div>
          <div>제목</div>
          <div>작성자</div>
          <div>카테고리</div>
          <div>조회수</div>
          <div>작성일</div>
          <div>관리</div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
            불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
            게시글이 없습니다
          </div>
        ) : (
          posts.map((post, idx) => (
            <div
              key={post.postId}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 120px 80px 80px 120px 80px',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: idx < posts.length - 1 ? '1px solid #F9FAFB' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{post.postId}</div>
              <div style={{
                fontSize: '13px', fontWeight: 600, color: '#111827',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                paddingRight: '12px'
              }}>
                {post.title}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{post.nickname}</div>
              <div>
                <span style={{
                  padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                  background: '#EEF2FF', color: '#4338CA'
                }}>
                  {categoryLabel[post.category] || post.category}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{post.viewCount}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{formatDate(post.createdAt)}</div>
              <div>
                <button
                  onClick={() => handleDeletePost(post.postId, post.title)}
                  style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    background: '#FEF2F2', color: '#DC2626',
                    border: '1px solid #FECACA'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminPostsPage