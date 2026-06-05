import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import Spinner from '../../components/Spinner'

const EditLecture = () => {
  const { lectureId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [video, setVideo] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', isFree: false, order: '', courseId: '' })

  useEffect(() => {
    const fetchLectureData = async () => {
      if (!lectureId || lectureId === 'undefined') return;
      try {
        const { data } = await api.get(`/lectures/${lectureId}`)
        setForm({
          title: data.title || '',
          description: data.description || '',
          isFree: data.isFree || false,
          order: data.order || 0,
          courseId: data.course || ''
        })
      } catch (err) {
        // Fallback or check another endpoint? 
        // Let's check backend routes for fetching a single lecture.
        toast.error('Failed to load lecture details')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    fetchLectureData()
  }, [lectureId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('isFree', form.isFree)
      formData.append('order', form.order || 0)
      if (video) formData.append('video', video)
      if (pdf) formData.append('pdf', pdf)

      await api.put(`/lectures/${lectureId}`, formData)
      toast.success('Lecture updated successfully!')
      navigate(`/faculty/courses/${form.courseId}/lectures`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lecture')
    } finally { setUpdating(false) }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Edit Lecture</h1>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label">Lecture Title *</label>
          <input type="text" className="input" placeholder="e.g. Introduction to React Hooks"
            value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} placeholder="What will students learn in this lecture?"
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Order Number</label>
            <input type="number" className="input" placeholder="1" min="0"
              value={form.order} onChange={e => setForm({...form, order: e.target.value})} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="isFree" className="w-4 h-4 accent-primary-600"
              checked={form.isFree} onChange={e => setForm({...form, isFree: e.target.checked})} />
            <label htmlFor="isFree" className="text-sm font-medium dark:text-gray-300">Free Preview Lecture</label>
          </div>
        </div>

        <div>
          <label className="label">Update Video (Optional — Max 200MB)</label>
          <input type="file" accept="video/*" className="input" onChange={e => setVideo(e.target.files[0])} />
          {video && <p className="text-sm text-green-600 mt-1">✓ New video: {video.name}</p>}
        </div>

        <div>
          <label className="label">Update PDF Notes (Optional)</label>
          <input type="file" accept=".pdf" className="input" onChange={e => setPdf(e.target.files[0])} />
          {pdf && <p className="text-sm text-green-600 mt-1">✓ New PDF: {pdf.name}</p>}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary px-8 py-2.5" disabled={updating}>
            {updating ? 'Updating...' : 'Update Lecture'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6 py-2.5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditLecture
