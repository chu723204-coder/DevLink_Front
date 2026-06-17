import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

const categories = [
  { value: 'FREE', label: '자유', color: '#4338CA', bg: '#EEF2FF' },
  { value: 'INTERVIEW', label: '면접후기', color: '#9D174D', bg: '#FDF2F8' },
  { value: 'TECH', label: '기술질문', color: '#166534', bg: '#F0FDF4' },
  { value: 'JOB', label: '취업정보', color: '#92400E', bg: '#FFFBEB' },
]

function PostWritePage() {
  const navigate = useNavigate()
  const { showToast } = useToastStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('FREE')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요.')
    if (!content.trim()) return alert('내용을 입력해주세요.')
    setLoading(true)
    try {
      const res = await api.post('/api/posts', null, {
        params: { title, content, category }
      })
      showToast('게시글이 작성되었습니다.', 'success')
      navigate(`/posts/${res.data.data.postId}`)
    } catch (e) {
      console.error('게시글 작성 실패', e)
      showToast('게시글 작성에 실패했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const selectedCat = categories.find(c => c.value === category)!

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

      {/* ✅ 헤더 - 목록으로 위, 제목 아래 분리 */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/posts')}
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
          게시글 작성
        </h1>
      </div>

      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #F3F4F6', padding: '32px',
        display: 'flex', flexDirection: 'column', gap: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>

        {/* 카테고리 */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px', display: 'block' }}>
            카테고리
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                style={{
                  padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
                  fontWeight: category === cat.value ? 600 : 500,
                  cursor: 'pointer', transition: 'all 0.15s', border: '2px solid',
                  borderColor: category === cat.value ? cat.color : '#E5E7EB',
                  background: category === cat.value ? cat.bg : '#fff',
                  color: category === cat.value ? cat.color : '#6B7280',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: 0 }} />

        {/* 제목 */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
            제목
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
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

        {/* 내용 */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
            내용
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="내용을 입력해주세요"
            rows={14}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: '10px',
              border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
              resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.7',
              color: '#374151', transition: 'border-color 0.15s',
              fontFamily: 'inherit'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#4338CA'}
            onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          />
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
            {content.length}자
          </div>
        </div>

        {/* 미리보기 */}
        <div style={{
          padding: '12px 16px', borderRadius: '10px',
          background: '#F9FAFB', border: '1px solid #F3F4F6',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{
            padding: '2px 10px', borderRadius: '20px', fontSize: '11px',
            fontWeight: 600, background: selectedCat.bg, color: selectedCat.color
          }}>
            {selectedCat.label}
          </span>
          <span style={{ fontSize: '13px', color: title ? '#111827' : '#9CA3AF', fontWeight: title ? 500 : 400 }}>
            {title || '제목을 입력하면 여기에 미리보기가 표시돼요'}
          </span>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
          <button
            onClick={() => navigate('/posts')}
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
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
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

export default PostWritePage