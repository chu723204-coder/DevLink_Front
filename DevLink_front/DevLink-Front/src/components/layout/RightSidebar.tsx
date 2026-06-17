import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../service/api'

const popularTags = [
  '알고리즘', '코딩테스트', '면접준비', 'Spring', 'React',
  'Java', 'Python', '취업후기', 'CS기초', '포트폴리오'
]

interface Study {
  studyId: number
  title: string
  techStacks: string
  currentMembers: number
  maxMembers: number
  deadline: string
}

function RightSidebar() {
  const navigate = useNavigate()
  const [studies, setStudies] = useState<Study[]>([])

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await api.get('/api/studies')
        const open = (res.data.data || []).filter((s: any) => s.status === 'OPEN')
        setStudies(open.slice(0, 3)) // 최대 3개만 표시
      } catch (e) {
        console.error('스터디 목록 조회 실패', e)
      }
    }
    fetchStudies()
  }, [])

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      position: 'sticky',
      top: '72px',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>

      {/* ✅ 모집 중인 스터디 - API 연동 */}
      <div style={{ background: '#fff', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>🔥 모집 중인 스터디</span>
          <span
            onClick={() => navigate('/studies')}
            style={{ fontSize: '11px', color: '#4338CA', cursor: 'pointer', fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            더보기
          </span>
        </div>

        {studies.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {studies.map(study => (
              <div
                key={study.studyId}
                onClick={() => navigate(`/studies/${study.studyId}`)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#F9FAFB',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: '1px solid transparent'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#EEF2FF'
                  e.currentTarget.style.borderColor = '#C7D2FE'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#F9FAFB'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {study.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    {study.techStacks?.split(',').slice(0, 2).map(t => t.trim()).join(' · ')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#4338CA', fontWeight: 600 }}>
                    {study.currentMembers}/{study.maxMembers}명
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>📚</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>모집 중인 스터디가 없어요</div>
          </div>
        )}
      </div>

      {/* ✅ 공지사항 - 빈 상태 개선 */}
      <div style={{ background: '#fff', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>📢 공지사항</div>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>🔔</div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>등록된 공지사항이 없어요</div>
        </div>
      </div>

      {/* ✅ 인기 태그 */}
      <div style={{ background: '#fff', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>🏷️ 인기 태그</div>
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
                transition: 'all 0.15s',
                fontWeight: 500
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#4338CA'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#EEF2FF'
                e.currentTarget.style.color = '#4338CA'
              }}
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