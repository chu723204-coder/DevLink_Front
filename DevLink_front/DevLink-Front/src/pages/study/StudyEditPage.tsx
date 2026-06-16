import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

function StudyEditPage() {
  const { studyId } = useParams<{ studyId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [techStacks, setTechStacks] = useState('')
  const [maxMembers, setMaxMembers] = useState(4)
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const res = await api.get(`/api/studies/${studyId}`)
        const study = res.data.data
        setTitle(study.title)
        setDescription(study.description)
        setTechStacks(study.techStacks || '')
        setMaxMembers(study.maxMembers)
        setDeadline(study.deadline || '')
      } catch (e) {
        console.error('스터디 조회 실패', e)
        navigate('/studies')
      }
    }
    fetchStudy()
  }, [studyId])

  const handleSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요.')
    if (!description.trim()) return alert('설명을 입력해주세요.')
    setLoading(true)
    try {
      await api.put(`/api/studies/${studyId}`, null, {
        params: { title, description, techStacks: techStacks || undefined, maxMembers, deadline: deadline || undefined }
      })
      showToast('스터디가 수정되었습니다.', 'success')
      navigate(`/studies/${studyId}`)
    } catch (e) {
      console.error('스터디 수정 실패', e)
      showToast('스터디 수정에 실패했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>스터디 수정</h1>

      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 제목 */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>제목</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="스터디 제목을 입력해주세요"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* 설명 */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>설명</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="스터디 설명을 입력해주세요"
            rows={6}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6' }}
          />
        </div>

        {/* 기술 스택 */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>기술 스택 <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(쉼표로 구분)</span></label>
          <input
            value={techStacks}
            onChange={e => setTechStacks(e.target.value)}
            placeholder="React, Spring Boot, Python"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* 모집 인원 / 마감일 */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>모집 인원</label>
            <input
              type="number"
              value={maxMembers}
              onChange={e => setMaxMembers(Number(e.target.value))}
              min={2}
              max={20}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>마감일 <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(선택)</span></label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={() => navigate(`/studies/${studyId}`)}
            style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '14px', background: '#F3F4F6', color: '#374151', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '14px', background: '#4338CA', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            {loading ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyEditPage