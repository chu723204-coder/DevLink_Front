import { useState, useEffect } from 'react'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

interface Report {
  reportId: number
  reporterId: number
  targetType: 'POST' | 'COMMENT'
  targetId: number
  reason: string
  etcReason: string | null
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
}

const reasonLabels: Record<string, string> = {
  SPAM: '스팸/도배',
  OBSCENE: '음란/선정성',
  ABUSE: '욕설/비방',
  ILLEGAL: '불법 정보',
  OTHER: '기타',
}

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:  { bg: '#FFFBEB', color: '#92400E', label: '대기중' },
  ACCEPTED: { bg: '#F0FDF4', color: '#166534', label: '처리완료' },
  REJECTED: { bg: '#F9FAFB', color: '#6B7280', label: '반려' },
}

function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const { success, error } = useToastStore()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/reports')
      setReports(res.data.data || [])
    } catch (e) {
      console.error('신고 목록 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (reportId: number, status: 'ACCEPTED' | 'REJECTED') => {
    const label = status === 'ACCEPTED' ? '처리' : '반려'
    if (!confirm(`해당 신고를 ${label}하시겠습니까?`)) return

    setProcessingId(reportId)
    try {
      await api.patch(`/api/admin/reports/${reportId}`, { status })
      setReports(prev => prev.map(r =>
        r.reportId === reportId ? { ...r, status } : r
      ))
      success(`신고가 ${label} 처리되었습니다.`)
    } catch (e) {
      console.error('신고 처리 실패', e)
      error('신고 처리에 실패했습니다.')
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
          신고 관리
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
          접수된 신고 목록을 확인하고 처리할 수 있습니다.
        </p>
      </div>

      {/* 통계 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: '전체', value: reports.length, color: '#4338CA', bg: '#EEF2FF' },
          { label: '대기중', value: reports.filter(r => r.status === 'PENDING').length, color: '#92400E', bg: '#FFFBEB' },
          { label: '처리완료', value: reports.filter(r => r.status === 'ACCEPTED').length, color: '#166534', bg: '#F0FDF4' },
          { label: '반려', value: reports.filter(r => r.status === 'REJECTED').length, color: '#6B7280', bg: '#F9FAFB' },
        ].map(stat => (
          <div key={stat.label} style={{
            padding: '14px 20px', borderRadius: '10px',
            background: stat.bg, border: `1px solid ${stat.bg}`,
            display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '100px'
          }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: stat.color }}>{stat.value}</span>
            <span style={{ fontSize: '12px', color: stat.color, fontWeight: 500 }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* 테이블 */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '1px solid #F3F4F6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
              {['신고 ID', '대상 유형', '대상 ID', '신고 사유', '신고일', '상태', '처리'].map(col => (
                <th key={col} style={{
                  padding: '12px 16px', fontSize: '12px', fontWeight: 600,
                  color: '#6B7280', textAlign: 'left'
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                  로딩 중...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚩</div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF' }}>접수된 신고가 없습니다.</div>
                </td>
              </tr>
            ) : reports.map(report => {
              const statusStyle = statusStyles[report.status]
              return (
                <tr key={report.reportId} style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B7280' }}>
                    #{report.reportId}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: report.targetType === 'POST' ? '#EEF2FF' : '#F0FDF4',
                      color: report.targetType === 'POST' ? '#4338CA' : '#166534'
                    }}>
                      {report.targetType === 'POST' ? '게시글' : '댓글'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>
                    #{report.targetId}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>
                    {reasonLabels[report.reason] || report.reason}
                    {report.reason === 'OTHER' && report.etcReason && (
                      <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '3px' }}>
                        └ {report.etcReason}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B7280' }}>
                    {formatDate(report.createdAt)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: statusStyle.bg, color: statusStyle.color
                    }}>
                      {statusStyle.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {report.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleUpdateStatus(report.reportId, 'ACCEPTED')}
                          disabled={processingId === report.reportId}
                          style={{
                            padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
                            background: '#F0FDF4', color: '#166534',
                            border: '1px solid #BBF7D0', cursor: 'pointer',
                            fontWeight: 600, transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#DCFCE7'}
                          onMouseLeave={e => e.currentTarget.style.background = '#F0FDF4'}
                        >
                          처리
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(report.reportId, 'REJECTED')}
                          disabled={processingId === report.reportId}
                          style={{
                            padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
                            background: '#F9FAFB', color: '#6B7280',
                            border: '1px solid #E5E7EB', cursor: 'pointer',
                            fontWeight: 600, transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                          onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}
                        >
                          반려
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>처리됨</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminReportsPage