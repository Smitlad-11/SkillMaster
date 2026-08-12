import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import getImageUrl from '../../utils/getImageUrl';

const API_URL = 'http://localhost:5000'

const FacultyStudents = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/courses/my-courses')
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Students</h1>
        <p className="text-gray-500">Select a course to view enrolled students</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-xl font-bold dark:text-white mb-2">No Courses Found</h2>
          <p className="text-gray-500 mb-6">Create a course first to start accepting students.</p>
          <Link to="/faculty/create-course" className="btn-primary">Create Course</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link key={course._id} to={`/faculty/courses/${course._id}/students`} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition">
              <img
                src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/400x200/9333ea/white?text=Course'}
                alt={course.title} className="w-full h-32 object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-lg dark:text-white line-clamp-1 mb-2">{course.title}</h3>
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {course.enrolledStudents?.length || 0} Students Enrolled &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default FacultyStudents
