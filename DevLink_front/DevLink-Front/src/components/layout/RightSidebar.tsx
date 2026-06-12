import { useNavigate } from 'react-router-dom'

const popularTags = [
  '알고리즘', '코딩테스트', '면접준비', 'Spring', 'React',
  'Java', 'Python', '취업후기', 'CS기초', '포트폴리오'
]

function RightSidebar() {
  const navigate = useNavigate()

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      position: 'sticky',
      top: '72px',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* 모집 중인 스터디 */}
      <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>모집 중인 스터디</span>
          <span onClick={() => navigate('/studies')} style={{ fontSize: '11px', color: '#4338CA', cursor: 'pointer' }}>더보기</span>
        </div>
        {/* TODO: 스터디 API 연동 예정 */}
        <div style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'center', padding: '12px 0' }}>
          준비 중입니다
        </div>
      </div>

      {/* 공지사항 */}
      <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>공지사항</div>
        {/* TODO: 공지사항 API 연동 예정 */}
        <div style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'center', padding: '12px 0' }}>
          준비 중입니다
        </div>
      </div>

      {/* 인기 태그 */}
      <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>인기 태그</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {popularTags.map(tag => (
            <span
              key={tag}
              onClick={() => navigate(`/posts?tag=${tag}`)}
              style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                background: '#EEF2FF',
                color: '#4338CA',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default RightSidebar