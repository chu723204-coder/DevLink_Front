import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../service/api'
import { useToastStore } from '../../store/toastStore'

function PostEditPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('FREE')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${postId}`)
        const post = res.data.data
        setTitle(post.title)
        setContent(post.content)
        setCategory(post.category)
      } catch (e) {
        console.error('게시글 조회 실패', e)
        navigate('/posts')
      }
    }
    fetchPost()
  }, [postId])

  const handleSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요.')
    if (!content.trim()) return alert('내용을 입력해주세요.')
    setLoading(true)
    try {
      await api.put(`/api/posts/${postId}`, null, {
        params: { title, content, category }
      })
      showToast('게시글이 수정되었습니다.', 'success')
      navigate(`/posts/${postId}`)
    } catch (e) {
      console.error('게시글 수정 실패', e)
      showToast('게시글 수정에 실패했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>게시글 수정</h1>

      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.1)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 카테고리 */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>카테고리</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', width: '200px', outline: 'none' }}
          >
            <option value="FREE">자유</option>
            <option value="INTERVIEW">면접후기</option>
            <option value="TECH">기술질문</option>
            <option value="JOB">취업정보</option>
          </select>
        </div>

        {/* 제목 */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>제목</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* 내용 */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px', display: 'block' }}>내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="내용을 입력해주세요"
            rows={12}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6' }}
          />
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={() => navigate(`/posts/${postId}`)}
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

export default PostEditPage