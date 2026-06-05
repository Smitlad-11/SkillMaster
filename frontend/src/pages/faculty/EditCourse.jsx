import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import Spinner from '../../components/Spinner'

const API_URL = 'http://localhost:5000'

const EditCourse = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Web Development',
    level: 'Beginner', tags: '', requirements: '', whatYouLearn: '', totalDuration: ''
  })

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || courseId === 'undefined') return;
      try {
        const { data } = await api.get(`/courses/${courseId}`)
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || 0,
          category: data.category || 'Web Development',
          level: data.level || 'Beginner',
          tags: data.tags?.join('\n') || '',
          requirements: data.requirements?.join('\n') || '',
          whatYouLearn: data.whatYouLearn?.join('\n') || '',
          totalDuration: data.totalDuration || ''
        })
        if (data.thumbnail) setPreview(`${API_URL}${data.thumbnail}`)
      } catch (err) {
        toast.error('Failed to load course details')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseData()
  }, [courseId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags' || k === 'requirements' || k === 'whatYouLearn') {
          formData.append(k, JSON.stringify(v.split('\n').filter(Boolean)))
        } else {
          formData.append(k, v)
        }
      })
      if (thumbnail) formData.append('thumbnail', thumbnail)

      await api.put(`/courses/${courseId}`, formData)
      toast.success('Course updated successfully!')
      navigate(-1)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update course')
    } finally { setUpdating(false) }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Edit Course</h1>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label">Course Title *</label>
          <input type="text" className="input" placeholder="e.g. Full Stack Web Development"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>

        <div>
          <label className="label">Description *</label>
          <textarea className="input" rows={4} placeholder="Describe what students will learn..."
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category *</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['Web Development', 'Data Science', 'AI/ML', 'Mobile Development', 'Design', 'DevOps', 'Database', 'Other'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Level *</label>
            <select className="input" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Price (₹) — Set 0 for free</label>
            <input type="number" className="input" placeholder="999" min="0"
              value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div>
            <label className="label">Course Duration *</label>
            <div className="flex gap-2">
              <select
                className="input flex-1"
                value={['1 Months', '2 Months', '3 Months', '4 Months', '5 Months', '6 Months'].includes(form.totalDuration) ? form.totalDuration : 'Custom'}
                onChange={e => {
                  const val = e.target.value;
                  setForm({ ...form, totalDuration: val === 'Custom' ? '' : val });
                }}
              >
                {['1 Months', '2 Months', '3 Months', '4 Months', '5 Months', '6 Months', 'Custom'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {(!['1 Months', '2 Months', '3 Months', '4 Months', '5 Months', '6 Months'].includes(form.totalDuration) || form.totalDuration === '') && (
                <input
                  type="text"
                  className="input flex-1 animate-in slide-in-from-left-1 duration-200"
                  placeholder="e.g. 8 Weeks"
                  value={form.totalDuration}
                  onChange={e => setForm({ ...form, totalDuration: e.target.value })}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="label">Thumbnail Image</label>
          <div className="flex items-center gap-4">
            {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border dark:border-gray-700" />}
            <div className="flex-1">
              <input type="file" accept="image/*" className="input" onChange={e => {
                const file = e.target.files[0]
                setThumbnail(file)
                if (file) setPreview(URL.createObjectURL(file))
              }} />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Tags </label>
          <textarea className="input" rows={2} placeholder="React&#10;Node.js&#10;MongoDB"
            value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
        </div>

        <div>
          <label className="label">Requirements</label>
          <textarea className="input" rows={3} placeholder="Basic JavaScript knowledge"
            value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} />
        </div>

        {/*<div>
          <label className="label">What Students Will Learn (one per line)</label>
          <textarea className="input" rows={3} placeholder="Build full stack apps"
            value={form.whatYouLearn} onChange={e => setForm({...form, whatYouLearn: e.target.value})} />
        </div>*/}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary px-8 py-2.5" disabled={updating}>
            {updating ? 'Updating...' : 'Update Course'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-8 py-2.5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCourse
