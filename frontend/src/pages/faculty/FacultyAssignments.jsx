import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import getImageUrl from '../../utils/getImageUrl';

const API_URL = 'http://localhost:5000'

const FacultyAssignments = () => {
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Assignments Dashboard</h1>
          <p className="text-gray-500">Manage assignments and grade submissions across your courses.</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold dark:text-white mb-2">No Courses Available</h2>
          <p className="text-gray-500 mb-6">Create courses first to add assignments to them.</p>
          <Link to="/faculty/create-course" className="btn-primary">Create Course</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300">Select a course to manage assignments:</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {courses.map(course => (
              <div key={course._id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <div className="flex items-center gap-4">
                  <img
                    src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/100x100/9333ea/white?text=C'}
                    alt="" className="w-16 h-12 rounded object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold dark:text-white">{course.title}</h3>
                    <p className="text-xs text-gray-500">{course.enrolledStudents?.length || 0} Students</p>
                  </div>
                </div>
                <Link
                  to={`/faculty/courses/${course._id}/assignments`}
                  className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium text-sm rounded transition"
                >
                  Manage Assignments &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FacultyAssignments
