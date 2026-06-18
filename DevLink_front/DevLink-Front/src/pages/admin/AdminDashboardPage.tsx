import { useState, useEffect } from 'react'
import api from '../../service/api'

interface Stats {
  totalUsers: number
  totalPosts: number
  totalStudies: number
  bannedUsers: number
}

function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/stats')
        setStats(res.data.data)
      } catch (e) {
        console.error('통계 조회 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = stats ? [
    { label: '전체 회원', value: stats.totalUsers, icon: '👥', color: '#4338CA', bg: '#EEF2FF' },
    { label: '전체 게시글', value: stats.totalPosts, icon: '📝', color: '#0891B2', bg: '#ECFEFF' },
    { label: '전체 스터디', value: stats.totalStudies, icon: '📚', color: '#059669', bg: '#ECFDF5' },
    { label: '정지 회원', value: stats.bannedUsers, icon: '🚫', color: '#DC2626', bg: '#FEF2F2' },
  ] : []

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>
          📊 대시보드
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '6px 0 0 0' }}>
          DevLink 서비스 현황을 확인하세요
        </p>
      </div>

      {/* 통계 카드 */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: '#fff', borderRadius: '16px', padding: '24px',
              border: '1px solid #F3F4F6', height: '100px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ width: '40%', height: '12px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '12px' }} />
              <div style={{ width: '60%', height: '28px', background: '#F9FAFB', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {cards.map(card => (
            <div key={card.label} style={{
              background: '#fff', borderRadius: '16px', padding: '24px',
              border: '1px solid #F3F4F6',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280' }}>
                  {card.label}
                </span>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  {card.icon}
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: card.color }}>
                {card.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 안내 */}
      <div style={{
        marginTop: '32px', padding: '20px 24px', borderRadius: '12px',
        background: '#EEF2FF', border: '1px solid #C7D2FE'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#4338CA', marginBottom: '6px' }}>
          💡 관리자 안내
        </div>
        <div style={{ fontSize: '12px', color: '#6366F1', lineHeight: '1.7' }}>
          좌측 메뉴에서 회원, 게시글, 스터디를 관리할 수 있습니다.<br />
          회원 정지/해제, 강제 탈퇴, 게시글/스터디 강제 삭제 기능을 제공합니다.
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage