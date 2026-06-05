// pages/faculty/CreateLecture.jsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'

const CreateLecture = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [video, setVideo] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', isFree: false, order: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!video) return toast.error('Please upload a video file')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('courseId', courseId)
      formData.append('isFree', form.isFree)
      formData.append('order', form.order || 0)
      formData.append('video', video)
      if (pdf) formData.append('pdf', pdf)

      await api.post('/lectures', formData)
      toast.success('Lecture uploaded successfully!')
      navigate(`/faculty/courses/${courseId}/lectures`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload lecture')
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Add New Lecture</h1>

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
          <label className="label">Video File * (MP4, MKV, WEBM — Max 200MB)</label>
          <input type="file" accept="video/*" className="input" onChange={e => setVideo(e.target.files[0])} required />
          {video && <p className="text-sm text-green-600 mt-1">✓ {video.name} ({(video.size / 1024 / 1024).toFixed(1)}MB)</p>}
        </div>

        <div>
          <label className="label">PDF Notes (Optional)</label>
          <input type="file" accept=".pdf" className="input" onChange={e => setPdf(e.target.files[0])} />
          {pdf && <p className="text-sm text-green-600 mt-1">✓ {pdf.name}</p>}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary px-8 py-2.5" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Lecture'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6 py-2.5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateLecture
