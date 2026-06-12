import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar'
import RightSidebar from '../../components/layout/RightSidebar'
import { useAuthStore } from '../../store/useAuthStore'
import PostCard from './PostCard'

// 임시 더미 데이터 (API 연동 전)
const dummyPosts = [
  {
    postId: 1,
    title: '카카오 코딩테스트 후기 공유합니다',
    content: '지난주에 카카오 코딩테스트를 응시했는데요, 생각보다 어렵지 않았습니다. 주로 그래프 탐색과 DP 문제가 나왔어요.',
    category: 'INTERVIEW',
    nickname: '개발자김',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    commentCount: 12,
    likeCount: 34,
    viewCount: 256,
    tags: ['카카오', '코딩테스트', '알고리즘']
  },
  {
    postId: 2,
    title: 'Spring Security JWT 구현 질문있어요',
    content: 'Spring Security에서 JWT 토큰 필터를 구현하다가 막혔는데 혹시 도움 주실 분 계신가요?',
    category: 'TECH',
    nickname: '스프링초보',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    commentCount: 5,
    likeCount: 8,
    viewCount: 89,
    tags: ['Spring', 'JWT', 'Security']
  },
  {
    postId: 3,
    title: '네이버 최종 합격 후기',
    content: '드디어 네이버 최종 합격했습니다! 코테부터 면접까지 준비 과정을 공유드려요.',
    category: 'JOB',
    nickname: '취뽀성공',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    commentCount: 28,
    likeCount: 102,
    viewCount: 1024,
    tags: ['네이버', '취업후기', '합격']
  },
  {
    postId: 4,
    title: '취준생 모여라! 스터디원 구합니다',
    content: '알고리즘 스터디 같이 하실 분 구합니다. 주 2회 온라인으로 진행할 예정이에요.',
    category: 'FREE',
    nickname: '스터디장',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    commentCount: 7,
    likeCount: 15,
    viewCount: 203,
    tags: ['스터디', '알고리즘']
  },
]

function PostListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuthStore()
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'comment'>('latest')

  const category = new URLSearchParams(location.search).get('category') || ''

  const filteredPosts = category
    ? dummyPosts.filter(p => p.category === category)
    : dummyPosts

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px' }}>
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      {/* 메인 피드 */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* 상단 헤더 */}
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
            {/* 정렬 필터 */}
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
            {/* 글쓰기 버튼 */}
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

        {/* 게시글 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard key={post.postId} {...post} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>
              게시글이 없습니다
            </div>
          )}
        </div>
      </main>

      {/* 오른쪽 사이드바 */}
      <RightSidebar />
    </div>
  )
}

export default PostListPage