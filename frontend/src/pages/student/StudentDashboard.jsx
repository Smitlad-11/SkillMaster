// pages/student/StudentDashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import ProgressBar from '../../components/ProgressBar'
import Spinner from '../../components/Spinner'
import getImageUrl from '../../utils/getImageUrl'



const StudentDashboard = () => {
  const { user } = useSelector(state => state.auth)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, progressRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/progress/my'),
        ])
        setEnrolledCourses(meRes.data.enrolledCourses || [])
        setProgress(progressRes.data || [])
      } catch { }
      setLoading(false)
    }
    fetchData()
  }, [])

  const getProgress = (courseId) => {
    const p = progress.find(p => p.course?._id === courseId || p.course === courseId)
    return p?.percentage || 0
  }

  if (loading) return <Spinner />

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Student Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white rounded-[2rem] p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">Mastering <span className="text-accent-500">New Skills</span> Today?</h1>
            <p className="text-primary-100 text-xl font-medium opacity-80">Welcome back, {user?.name.split(' ')[0]}. You're closer to your goals than yesterday.</p>
            
            <div className="flex gap-4 mt-10 justify-center md:justify-start">
              <Link to="/courses" className="bg-white text-primary-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">Explore More</Link>
              <Link to="/student/assignments" className="bg-primary-700/50 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest backdrop-blur-md hover:bg-primary-700 transition-colors">Check Tasks</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/10 text-center group hover:bg-white/20 transition-all">
              <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{enrolledCourses.length}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Enrolled</p>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/10 text-center group hover:bg-white/20 transition-all">
              <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{progress.filter(p => p.completed).length}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Completed</p>
            </div>
            <div className="bg-accent-500/20 p-6 rounded-3xl backdrop-blur-xl border border-accent-500/20 text-center col-span-2 group hover:bg-accent-500/30 transition-all">
              <p className="text-xl font-black mb-1 group-hover:scale-105 transition-transform">In Progress</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{progress.filter(p => p.percentage > 0 && !p.completed).length} Specialized Units</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Active <span className="text-primary-600">Learning Path</span></h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Pick up exactly where you left off</p>
          </div>
          <Link to="/courses" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:translate-x-2 transition-transform">Browse Catalog →</Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="card !p-20 text-center flex flex-col items-center">
            <div className="text-8xl mb-6 transform hover:scale-110 transition-transform cursor-default">✨</div>
            <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">Unleash Your Potential</p>
            <p className="text-gray-500 font-medium mb-10 max-w-sm">Join thousands of students mastering the world's most in-demand skills.</p>
            <Link to="/courses" className="btn-primary !px-12">Discover First Course</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(course => {
              const perc = getProgress(course._id);
              return (
                <div key={course._id} className="card !p-0 group overflow-hidden border-2 border-transparent hover:border-primary-100 transition-all duration-500">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/600x400/82308E/white?text=In-Progress'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute bottom-4 left-6 right-6">
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">Course Progress</span>
                          <span className="text-sm font-black text-white">{perc}%</span>
                       </div>
                       <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                          <div className="h-full bg-accent-500 shadow-[0_0_10px_rgba(243,112,33,0.5)] transition-all duration-1000" style={{ width: `${perc}%` }}></div>
                       </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-black text-lg text-gray-900 dark:text-white line-clamp-2 mb-6 group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-tight">{course.title}</h3>
                    <div className="flex gap-3">
                       <Link to={`/student/watch/${course._id}`} className="flex-1 text-center py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-600/20 transform hover:-translate-y-1 active:scale-95 transition-all">
                        {perc > 0 ? 'Resume Unit' : 'Launch Course'}
                       </Link>
                       <Link to={`/courses/${course._id}`} className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-2xl hover:text-primary-600 transition-all">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Area (Placeholder) */}
      <div className="pt-12 border-t border-gray-100 dark:border-gray-800">
         <div className="card !bg-gray-900 !p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 opacity-20 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
               <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Want to <span className="text-primary-600">Upskill?</span></h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Unlock more premium programs tailored for your career path</p>
               </div>
               <Link to="/courses" className="btn-primary !px-10 !py-4 shadow-2xl">Browse All Programs</Link>
            </div>
         </div>
      </div>
    </div>
  )
}

export default StudentDashboard
