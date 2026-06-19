import { useState } from 'react'
import { useToastStore } from '../../store/toastStore'
import api from '../../service/api'

interface Props {
  targetType: 'POST' | 'COMMENT'
  targetId: number
  onClose: () => void
}

const REASONS = [
  { value: 'SPAM', label: '스팸/도배' },
  { value: 'OBSCENE', label: '음란/선정성' },
  { value: 'ABUSE', label: '욕설/비방' },
  { value: 'ILLEGAL', label: '불법 정보' },
  { value: 'OTHER', label: '기타' },
]

function ReportModal({ targetType, targetId, onClose }: Props) {
  const [selectedReason, setSelectedReason] = useState('')
  const [etcReason, setEtcReason] = useState('')
  const [loading, setLoading] = useState(false)
  const { success, error } = useToastStore()

  const handleSubmit = async () => {
    if (!selectedReason) {
      error('신고 사유를 선택해 주세요.')
      return
    }
    if (selectedReason === 'OTHER' && !etcReason.trim()) {
      error('기타 사유를 입력해 주세요.')
      return
    }

    setLoading(true)
    try {
      await api.post('/api/reports', {
        targetType,
        targetId,
        reason: selectedReason,
        etcReason: selectedReason === 'OTHER' ? etcReason.trim() : null,
      })
      success('신고가 접수되었습니다.')
      onClose()
    } catch (e: any) {
      error(e?.response?.data?.message || '신고 접수에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: '16px',
          padding: '28px', width: '380px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>신고하기</div>
          <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>신고 사유를 선택해 주세요.</div>
        </div>

        {/* 사유 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {REASONS.map(r => (
            <div
              key={r.value}
              onClick={() => {
                setSelectedReason(r.value)
                if (r.value !== 'OTHER') setEtcReason('')
              }}
              style={{
                padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                border: `1.5px solid ${selectedReason === r.value ? '#4338CA' : '#E5E7EB'}`,
                background: selectedReason === r.value ? '#EEF2FF' : '#fff',
                color: selectedReason === r.value ? '#4338CA' : '#374151',
                fontSize: '14px', fontWeight: selectedReason === r.value ? 600 : 400,
                transition: 'all 0.15s'
              }}
            >
              {r.label}
            </div>
          ))}
        </div>

        {/* 기타 사유 입력창 */}
        {selectedReason === 'OTHER' && (
          <div style={{ marginBottom: '16px' }}>
            <textarea
              value={etcReason}
              onChange={e => setEtcReason(e.target.value)}
              placeholder="기타 사유를 입력해 주세요. (최대 100자)"
              maxLength={100}
              rows={3}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                border: '1.5px solid #4338CA', fontSize: '13px',
                outline: 'none', resize: 'none', boxSizing: 'border-box',
                color: '#374151', lineHeight: '1.5'
              }}
            />
            <div style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'right', marginTop: '4px' }}>
              {etcReason.length}/100
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px', borderRadius: '8px',
              border: '1px solid #E5E7EB', background: '#fff',
              fontSize: '14px', fontWeight: 500, color: '#6B7280', cursor: 'pointer'
            }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1, padding: '11px', borderRadius: '8px',
              border: 'none', background: loading ? '#A5B4FC' : '#4338CA',
              fontSize: '14px', fontWeight: 600, color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '접수 중...' : '신고 접수'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportModal