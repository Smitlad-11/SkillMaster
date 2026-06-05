// pages/faculty/CourseLectures.jsx
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const CourseLectures = () => {
  const { courseId } = useParams()
  const [lectures, setLectures] = useState([])
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [courseRes, lectureRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/lectures/course/${courseId}`)
      ])
      setCourse(courseRes.data)
      setLectures(lectureRes.data)
    } catch { }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [courseId])

  const deleteLecture = async (id, title) => {
    if (!confirm(`Delete lecture "${title}"?`)) return
    try {
      await api.delete(`/lectures/${id}`)
      toast.success('Lecture deleted')
      fetchData()
    } catch { toast.error('Failed to delete lecture') }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Course Lectures</h1>
          <p className="text-gray-500 dark:text-gray-400">{course?.title}</p>
        </div>
        <Link to={`${window.location.pathname.replace('/lectures', '')}/add-lecture`} className="btn-primary">+ Add Lecture</Link>
      </div>

      {lectures.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">🎬</div>
          <p className="text-gray-500 dark:text-gray-400">No lectures yet</p>
          <Link to={`${window.location.pathname.replace('/lectures', '')}/add-lecture`} className="btn-primary mt-4 inline-block">
            Upload First Lecture
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['#', 'Title', 'Duration', 'Preview', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {lectures.map((lecture, i) => (
                <tr key={lecture._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{lecture.order || i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium dark:text-white">{lecture.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{lecture.description}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {Math.floor(lecture.duration / 60)} min
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${lecture.isFree ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {lecture.isFree ? 'Free' : 'Paid'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`${window.location.pathname}/${lecture._id}/edit`}
                        className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition font-medium">
                        Edit
                      </Link>
                      <button onClick={() => deleteLecture(lecture._id, lecture.title)}
                        className="text-xs px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CourseLectures
