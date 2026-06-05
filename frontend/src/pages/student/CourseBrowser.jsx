// pages/student/CourseBrowser.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../../redux/slices/courseSlice'
import CourseCard from '../../components/CourseCard'
import Spinner from '../../components/Spinner'
import Sidebar from '../../components/Sidebar'

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'AI/ML', 'Mobile Development', 'Design', 'DevOps']
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

const CourseBrowser = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { courses, loading, total, pages } = useSelector(state => state.courses)
  const [filters, setFilters] = useState({ category: '', level: '', search: '', page: 1 })

  useEffect(() => {
    const params = {}
    if (filters.category) params.category = filters.category
    if (filters.level) params.level = filters.level
    if (filters.search) params.search = filters.search
    params.page = filters.page
    dispatch(fetchCourses(params))
  }, [filters, dispatch])

  return (
    <div className={`flex ${user ? 'min-h-[calc(100vh-64px)]' : ''}`}>
      <Sidebar />
      <div className={`flex-1 ${user ? 'bg-gray-50 dark:bg-gray-900 overflow-auto' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Our Premium <span className="text-primary-600">Learning Catalog</span></h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">{total} Professional Programs Available</p>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12 p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-premium border border-gray-100 dark:border-gray-700">
        <div className="lg:col-span-2 relative">
          <input
            type="text" placeholder="What do you want to learn today?" className="input !bg-gray-50/50 !pl-12"
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value, page: 1})}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">🔍</span>
        </div>
        <div className="relative">
          <select className="input !bg-gray-50/50 appearance-none font-bold text-sm" value={filters.category}
            onChange={e => setFilters({...filters, category: e.target.value === 'All' ? '' : e.target.value, page: 1})}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-600 pointer-events-none">▼</span>
        </div>
        <div className="relative">
          <select className="input !bg-gray-50/50 appearance-none font-bold text-sm" value={filters.level}
            onChange={e => setFilters({...filters, level: e.target.value === 'All' ? '' : e.target.value, page: 1})}>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-600 pointer-events-none">▼</span>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          {courses.length === 0 ? (
            <div className="card !p-20 text-center">
              <div className="text-8xl mb-6 transform hover:scale-110 transition-transform cursor-default">🕵️‍♂️</div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Matching Courses Found</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Try broadening your search or switching categories.</p>
              <button onClick={() => setFilters({category: '', level: '', search: '', page: 1})} className="btn-secondary !mt-8">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setFilters({...filters, page: p})}
                  className={`w-12 h-12 rounded-2xl font-black text-sm transition-all duration-300 ${
                    filters.page === p 
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 scale-110' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-gray-100 dark:border-gray-700'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
        </div>
      </div>
    </div>
  )
}

export default CourseBrowser
