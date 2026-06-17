import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

function StudyWritePage() {
  const navigate = useNavigate()
  const { showToast } = useToastStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [techStacks, setTechStacks] = useState('')
  const [maxMembers, setMaxMembers] = useState(4)
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요.')
    if (!description.trim()) return alert('설명을 입력해주세요.')
    setLoading(true)
    try {
      const res = await api.post('/api/studies', null, {
        params: { title, description, techStacks: techStacks || undefined, maxMembers, deadline: deadline || undefined }
      })
      showToast('스터디 모집글이 등록되었습니다.', 'success')
      navigate(`/studies/${res.data.data.studyId}`)
    } catch (e) {
      console.error('스터디 등록 실패', e)
      showToast('스터디 등록에 실패했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // 기술 스택 미리보기
  const techStackList = techStacks
    ? techStacks.split(',').map(s => s.trim()).filter(s => s)
    : []

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

      {/* ✅ 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/studies')}
          style={{
            background: 'none', border: 'none', color: '#6B7280',
            cursor: 'pointer', fontSize: '13px', padding: '6px 10px',
            borderRadius: '6px', transition: 'all 0.15s',
            marginBottom: '12px', display: 'block'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F3F4F6'
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = '#6B7280'
          }}
        >
          ← 목록으로
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
          스터디 모집 등록
        </h1>
      </div>

      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6', padding: '32px',
        display: 'flex', flexDirection: 'column', gap: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>

        {/* 제목 */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
            제목
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="스터디 제목을 입력해주세요"
            maxLength={100}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '1px solid #E5E7EB', fontSize: '15px', outline: 'none',
              boxSizing: 'border-box', transition: 'border-color 0.15s',
              fontWeight: 500, color: '#111827'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
            onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          />
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
            {title.length} / 100
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: 0 }} />

        {/* 설명 */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
            설명
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="스터디 목표, 진행 방식, 일정 등을 자세히 적어주세요"
            rows={8}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: '10px',
              border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
              resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.7',
              color: '#374151', transition: 'border-color 0.15s', fontFamily: 'inherit'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
            onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          />
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
            {description.length}자
          </div>
        </div>

        {/* 기술 스택 */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
            기술 스택 <span style={{ color: '#9CA3AF', fontWeight: 400 }}>쉼표로 구분</span>
          </label>
          <input
            value={techStacks}
            onChange={e => setTechStacks(e.target.value)}
            placeholder="React, Spring Boot, Python"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
              boxSizing: 'border-box', transition: 'border-color 0.15s', color: '#374151'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
            onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          />
          {/* ✅ 기술 스택 미리보기 */}
          {techStackList.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              {techStackList.map(stack => (
                <span key={stack} style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                  background: '#EEF2FF', color: '#4338CA', fontWeight: 500
                }}>
                  {stack}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 모집 인원 / 마감일 */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
              모집 인원
            </label>
            <input
              type="number"
              value={maxMembers}
              onChange={e => setMaxMembers(Number(e.target.value))}
              min={2} max={20}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s', color: '#374151'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
              onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
            />
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
              최소 2명 ~ 최대 20명
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
              마감일 <span style={{ color: '#9CA3AF', fontWeight: 400 }}>선택</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s', color: '#374151'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
              onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
          <button
            onClick={() => navigate('/studies')}
            style={{
              padding: '10px 20px', borderRadius: '8px', fontSize: '14px',
              background: '#F9FAFB', color: '#374151',
              border: '1px solid #E5E7EB', cursor: 'pointer', fontWeight: 500,
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
            onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '10px 24px', borderRadius: '8px', fontSize: '14px',
              background: loading ? '#A5B4FC' : '#4338CA',
              color: '#fff', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600, transition: 'all 0.15s',
              boxShadow: loading ? 'none' : '0 1px 3px rgba(67,56,202,0.3)'
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3730A3' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4338CA' }}
          >
            {loading ? '등록 중...' : '✏️ 등록'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyWritePage