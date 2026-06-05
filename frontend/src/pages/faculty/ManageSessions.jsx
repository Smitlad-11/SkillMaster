// pages/faculty/ManageSessions.jsx
import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const ManageSessions = () => {
  const [sessions, setSessions] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', link: '', courseId: ''
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sessRes, courseRes] = await Promise.all([
        api.get('/sessions/faculty'),
        api.get('/courses/my-courses')
      ])
      
      setSessions(sessRes.data)
      setCourses(courseRes.data)
    } catch (err) {
      toast.error('Failed to load session data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/sessions', form)
      toast.success('Live session scheduled!')
      setShowAdd(false)
      setForm({ title: '', description: '', date: '', time: '', link: '', courseId: '' })
      fetchData()
    } catch { toast.error('Failed to schedule session') }
  }

  const deleteSession = async (id) => {
    if(!confirm('Delete this session?')) return
    try {
      await api.delete(`/sessions/${id}`)
      toast.success('Session cancelled')
      fetchData()
    } catch { toast.error('Failed to cancel session') }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 uppercase">Live <span className="text-primary-600">Events</span></h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Schedule and manage interactive learning sessions</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary !px-8 shadow-xl">Schedule New Session</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.map(s => (
          <div key={s._id} className="card !p-8 border-2 border-transparent hover:border-primary-100 transition-all flex flex-col">
             <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 text-xl font-black">🗓️</div>
                <button onClick={() => deleteSession(s._id)} className="text-red-500 opacity-30 hover:opacity-100 transition-opacity">🗑️</button>
             </div>
             <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">{s.course?.title}</p>
             <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">{s.title}</h3>
             
             <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-400">
                   <span>🕒 {new Date(s.date).toLocaleDateString()} @ {s.time}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>
             </div>

             <a href={s.link} target="_blank" rel="noreferrer" className="btn-secondary w-full text-center mt-8 !py-3 !text-[10px] font-black uppercase tracking-widest bg-gray-50 dark:bg-gray-800 border-none">
                Join Masterclass
             </a>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
           <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">New <span className="text-primary-600">Session</span></h2>
                 <button onClick={() => setShowAdd(false)} className="text-2xl hover:rotate-90 transition-transform">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Link to Course</label>
                    <select className="input" required value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})}>
                       <option value="">Select a Program</option>
                       {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Session Title</label>
                    <input type="text" className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Q&A and Portfolio Review" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Date</label>
                       <input type="date" className="input" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Start Time</label>
                       <input type="time" className="input" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Meeting Link (Zoom/Meet)</label>
                    <input type="url" className="input" required value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://meet.google.com/..." />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Short Agenda</label>
                    <textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                 </div>
                 <button type="submit" className="btn-primary w-full !py-4 shadow-xl mt-4">Confirm Schedule</button>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}

export default ManageSessions
