// pages/student/StudentSessions.jsx
import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/Spinner'

const StudentSessions = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get('/sessions/my')
        setSessions(data)
      } catch { }
      setLoading(false)
    }
    fetchSessions()
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <div>
         <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 uppercase">Live <span className="text-primary-600">Masterclasses</span></h1>
         <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Interactive learning sessions with your instructors</p>
      </div>

      {sessions.length === 0 ? (
        <div className="card !p-20 text-center">
           <div className="text-6xl mb-6 grayscale opacity-20">📅</div>
           <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No upcoming sessions scheduled yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map(s => (
            <div key={s._id} className="card !p-8 border-2 border-transparent hover:border-primary-100 transition-all flex flex-col group">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 text-xl font-black group-hover:scale-110 transition-transform">🗓️</div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full">Coming Soon</div>
               </div>
               
               <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">{s.course?.title}</p>
               <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 group-hover:text-primary-600 transition-colors">{s.title}</h3>
               
               <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xs">👤</div>
                     <p className="text-xs font-bold text-gray-600 dark:text-gray-400">By {s.faculty?.name}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Schedule</p>
                     <p className="text-xs font-bold text-gray-900 dark:text-white">{new Date(s.date).toLocaleDateString()} at {s.time}</p>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-3">{s.description}</p>
               </div>

               <a href={s.link} target="_blank" rel="noreferrer" className="btn-primary w-full text-center mt-8 !py-3.5 !text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Join Live Session
               </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentSessions
