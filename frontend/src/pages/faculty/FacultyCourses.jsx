import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import getImageUrl from '../../utils/getImageUrl';



const FacultyCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses/my-courses')
      setCourses(data)
    } catch { }
    setLoading(false)
  }

  const deleteCourse = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      await api.delete(`/courses/${id}`)
      toast.success('Course deleted')
      fetchCourses()
    } catch { toast.error('Failed to delete course') }
  }

  useEffect(() => { fetchCourses() }, [])

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">My Professional <span className="text-primary-600">Courses</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Manage your curriculum and student engagement</p>
        </div>
        <Link to="/faculty/create-course" className="btn-primary flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-transform">
          <span className="text-xl">+</span> Create New Program
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="card !p-20 text-center flex flex-col items-center">
          <div className="text-8xl mb-6 animate-bounce">📚</div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">No Programs Created Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-sm">Start your teaching journey today by creating your first premium course.</p>
          <Link to="/faculty/create-course" className="btn-primary !px-10 !py-4 shadow-2xl">Launch Your First Course</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course._id} className="card !p-0 group overflow-hidden border-2 border-transparent hover:border-primary-100 transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/400x200/82308E/white?text=Course'}
                  alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                   <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest shadow-lg ${course.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {course.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col mb-4">
                   <h3 className="font-black text-xl text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                   <div className="flex items-center gap-4 mt-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 px-3 py-1.5 bg-primary-50 rounded-xl">👥 {course.enrolledStudents?.length || 0} Learners</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent-600 px-3 py-1.5 bg-accent-50 rounded-xl">⭐ {course.averageRating || '4.8'}</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                   <Link to={`/faculty/courses/${course._id}/edit`} className="text-center text-[10px] font-black uppercase tracking-widest py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                     Edit Details
                   </Link>
                   <button onClick={() => deleteCourse(course._id, course.title)} className="text-[10px] font-black uppercase tracking-widest py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                     Remove
                   </button>
                </div>

                <div className="pt-5 border-t border-gray-100 dark:border-gray-700/50 flex justify-between gap-3">
                   <Link to={`/faculty/courses/${course._id}/lectures`} className="flex-1 text-center py-2.5 bg-primary-50 text-primary-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all">
                     🎬 Sessions
                   </Link>
                   <Link to={`/faculty/courses/${course._id}/students`} className="flex-1 text-center py-2.5 bg-accent-50 text-accent-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-600 hover:text-white transition-all">
                     👥 Students
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FacultyCourses
