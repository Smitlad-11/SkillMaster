// pages/faculty/FacultyDashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import getImageUrl from '../../utils/getImageUrl';

const API_URL = 'http://localhost:5000'

const FacultyDashboard = () => {
  const { user } = useSelector(state => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses/my-courses')
      setCourses(data)
    } catch { }
    setLoading(false)
  }

  useEffect(() => { fetchCourses() }, [])

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0)
  const totalLectures = courses.reduce((sum, c) => sum + (c.lectures?.length || 0), 0)

  const allStudents = []
  const studentIds = new Set()
  courses.forEach(c => {
    (c.enrolledStudents || []).forEach(s => {
      if (typeof s === 'object' && s._id) {
        if (!studentIds.has(s._id.toString())) {
          studentIds.add(s._id.toString())
          allStudents.push({ ...s, enrolledIn: [c.title] })
        } else {
          const exist = allStudents.find(x => x._id.toString() === s._id.toString())
          if (exist) exist.enrolledIn.push(c.title)
        }
      }
    })
  })

  const togglePublish = async (id) => {
    try {
      const { data } = await api.put(`/courses/${id}/publish`)
      toast.success(data.message)
      fetchCourses()
    } catch { toast.error('Failed') }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white rounded-[2rem] p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">Elite Instructor <span className="text-accent-500">Workspace</span></h1>
            <p className="text-primary-100 text-xl font-medium opacity-80">Welcome back, Professor {user?.name.split(' ')[0]}. Here's your impact today.</p>
            
            <div className="flex gap-4 mt-10 justify-center md:justify-start">
              <Link to="/faculty/create-course" className="bg-white text-primary-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">Create Program</Link>
              <Link to="/faculty/students" className="bg-primary-700/50 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest backdrop-blur-md hover:bg-primary-700 transition-colors">View Network</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/10 text-center group hover:bg-white/20 transition-all">
              <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{courses.length}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Programs</p>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/10 text-center group hover:bg-white/20 transition-all">
              <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{totalStudents}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Learners</p>
            </div>
            <div className="bg-accent-500/20 p-6 rounded-3xl backdrop-blur-xl border border-accent-500/20 text-center col-span-2 group hover:bg-accent-500/30 transition-all">
              <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{totalLectures}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 font-black">Published Sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Course Performance */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Active <span className="text-primary-600">Programs</span></h2>
              <Link to="/faculty/courses" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:translate-x-2 transition-transform">See All Metrics →</Link>
           </div>

           {courses.length === 0 ? (
             <div className="card !p-20 text-center">
                <p className="text-gray-400 font-bold mb-4">You haven't launched any programs yet.</p>
                <Link to="/faculty/create-course" className="btn-primary">Launch First Program</Link>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
                {courses.slice(0, 3).map(course => (
                  <div key={course._id} className="card group !p-6 flex flex-col md:flex-row items-center gap-6 border-2 border-transparent hover:border-primary-100 transition-all duration-500">
                    <img 
                      src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/120x80/82308E/white?text=CP'} 
                      className="w-full md:w-32 h-24 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 text-center md:text-left">
                       <h3 className="font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{course.title}</h3>
                       <div className="flex flex-wrap justify-center md:justify-start gap-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl">👥 {course.enrolledStudents?.length || 0} Learners</span>
                          <span className="text-[10px] font-black text-accent-600 uppercase tracking-widest bg-accent-50 px-3 py-1.5 rounded-xl">⭐ {course.averageRating || '4.8'}</span>
                       </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                       <Link to={`/faculty/courses/${course._id}/lectures`} className="flex-1 md:flex-none text-center px-6 py-3 bg-primary-50 text-primary-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all">Studio</Link>
                       <Link to={`/faculty/courses/${course._id}/edit`} className="flex-1 md:flex-none text-center px-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Edit</Link>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-1 space-y-8">
           <div className="px-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Recent <span className="text-accent-500">Learners</span></h2>
           </div>
           
           <div className="card !p-0 overflow-hidden shadow-premium">
              <div className="p-8 space-y-6">
                 {allStudents.length === 0 ? (
                   <p className="text-center text-gray-400 font-bold py-10">No students enrolled yet.</p>
                 ) : (
                   allStudents.slice(0, 6).map(student => (
                     <div key={student._id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">
                              {student.name?.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors uppercase tracking-tight">{student.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[120px]">{student.enrolledIn[0]}</p>
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl uppercase tracking-widest">{new Date(student.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                     </div>
                   ))
                 )}
              </div>
              <Link to="/faculty/students" className="block w-full py-4 bg-gray-50 dark:bg-gray-800 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all">
                 Manage Network Network →
              </Link>
           </div>

           {/* Quick Actions Card */}
           <div className="card !bg-accent-500 text-white !p-8 shadow-2xl shadow-accent-500/20">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Faculty Support</h3>
              <p className="text-xs font-bold text-accent-100 opacity-80 mb-6 uppercase tracking-widest leading-relaxed">Need help with your curriculum? Our instructor success team is here.</p>
              <Link to="/contact" className="inline-block bg-white text-accent-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">Get Support</Link>
           </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyDashboard
