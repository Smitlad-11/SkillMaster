import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import getImageUrl from '../../utils/getImageUrl'



const Certificates = () => {
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/progress/my')
        setProgress(data || [])
      } catch { }
      setLoading(false)
    }
    fetchData()
  }, [])

  const completedCourses = progress.filter(p => p.completed && p.certificateUrl)

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Certificates</h1>
        <p className="text-gray-500">Your hard-earned accomplishments</p>
      </div>

      {completedCourses.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-3xl shadow-sm border border-dashed border-gray-200 dark:border-gray-700">
          <div className="text-7xl mb-6 opacity-80">🏆</div>
          <h2 className="text-2xl font-bold dark:text-white mb-3">No Certificates Yet</h2>
          <p className="text-gray-500 mb-6 text-lg max-w-md mx-auto">Complete a course to earn your first certificate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {completedCourses.map(p => (
            <div key={p._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">🎓</div>
                <h3 className="font-bold text-xl dark:text-white line-clamp-2 mb-3 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{p.course?.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">Completed on {new Date(p.updatedAt).toLocaleDateString()}</p>
                
                <a 
                  href={getImageUrl(p.certificateUrl)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full text-center py-3 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-600 dark:hover:text-white font-bold transition-colors duration-300 shadow-sm hover:shadow-md"
                >
                  Download Certificate
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Certificates
