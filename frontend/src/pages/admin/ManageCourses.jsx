// pages/admin/ManageCourses.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import getImageUrl from '../../utils/getImageUrl';



const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/courses/all')
      setCourses(data)
    } catch { }
    setLoading(false)
  }

  useEffect(() => { fetchCourses() }, [])

  const deleteCourse = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await api.delete(`/courses/${id}`)
      toast.success('Course deleted')
      fetchCourses()
    } catch { toast.error('Failed to delete course') }
  }

  const togglePublish = async (id) => {
    try {
      const { data } = await api.put(`/courses/${id}/publish`)
      toast.success(data.message)
      fetchCourses()
    } catch { toast.error('Failed to update course') }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 uppercase">Manage <span className="text-primary-600">Courses</span></h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{courses.length} total programs found</p>
        </div>
        <Link to="/admin/create-course" className="btn-primary !px-8 shadow-2xl">Create New Course</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course._id} className="card !p-0 group overflow-hidden border-2 border-transparent hover:border-primary-100 transition-all duration-500">
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/400x180/82308E/white?text=Course'}
                alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                 <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest shadow-lg ${
                  course.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {course.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1">{course.category} • {course.level}</span>
                <h3 className="font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                <p className="text-xs font-bold text-gray-400 mt-1">Instructor: <span className="text-gray-600 dark:text-gray-300">{course.faculty?.name}</span></p>
              </div>
              
              <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                 <span className="text-lg font-black text-primary-600">₹{course.price}</span>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">{course.enrolledStudents?.length || 0} Learners</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => togglePublish(course._id)}
                  className={`text-[10px] py-2.5 rounded-xl font-black uppercase tracking-widest transition-all ${
                    course.isPublished ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}>
                  {course.isPublished ? 'Deactivate' : 'Publish'}
                </button>
                <Link to={`/admin/courses/${course._id}/edit`} className="text-[10px] py-2.5 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white font-black uppercase tracking-widest text-center transition-all">
                  Edit Details
                </Link>
                <Link to={`/admin/courses/${course._id}/lectures`} className="text-[10px] py-2.5 rounded-xl bg-accent-50 text-accent-600 hover:bg-accent-600 hover:text-white font-black uppercase tracking-widest text-center transition-all">
                  Curriculum
                </Link>
                <Link to={`/courses/${course._id}`} className="text-[10px] py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-900 hover:text-white font-black uppercase tracking-widest text-center transition-all dark:bg-gray-700 dark:text-gray-300">
                  Preview
                </Link>
                <button onClick={() => deleteCourse(course._id, course.title)}
                  className="col-span-2 text-[10px] py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black uppercase tracking-widest transition-all mt-2 shadow-sm">
                  Delete Course Forever
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageCourses
