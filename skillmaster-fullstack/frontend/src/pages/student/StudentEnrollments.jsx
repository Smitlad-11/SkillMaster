import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import ProgressBar from '../../components/ProgressBar'
import Spinner from '../../components/Spinner'

const API_URL = 'http://localhost:5000'

const StudentEnrollments = () => {
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Enrollments</h1>
        <p className="text-gray-500">Pick up where you left off</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-3xl shadow-sm border border-dashed border-gray-200 dark:border-gray-700">
          <div className="text-7xl mb-6 opacity-80">📚</div>
          <h2 className="text-2xl font-bold dark:text-white mb-3">No Enrollments Yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">You haven't enrolled in any courses. Explore our catalog to start learning!</p>
          <Link to="/courses" className="btn-primary shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 px-8 py-3 rounded-xl text-lg font-semibold">Explore Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map(course => (
            <div key={course._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col group">
              <div className="relative overflow-hidden aspect-[16/9]">
                <img
                  src={course.thumbnail ? `${API_URL}${course.thumbnail}` : 'https://placehold.co/600x400/2563EB/white?text=Course'}
                  alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl dark:text-white line-clamp-2 mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{course.title}</h3>
                <div className="mt-auto">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    <span>Course Progress</span>
                    <span className="text-primary-600 dark:text-primary-400 font-bold">{getProgress(course._id)}%</span>
                  </div>
                  <ProgressBar percentage={getProgress(course._id)} />
                  <Link to={`/student/watch/${course._id}`} className="mt-6 block w-full text-center py-3 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-600 dark:hover:text-white font-bold transition-colors duration-300">
                    {getProgress(course._id) > 0 ? 'Continue Learning' : 'Start Learning'}
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

export default StudentEnrollments
