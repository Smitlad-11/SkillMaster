// pages/student/CourseDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourse } from '../../redux/slices/courseSlice'
import { purchaseCourse } from '../../services/paymentService'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import getImageUrl from '../../utils/getImageUrl'



const CourseDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { course, loading } = useSelector(state => state.courses)
  const { user } = useSelector(state => state.auth)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => { dispatch(fetchCourse(id)) }, [id, dispatch])

  const isEnrolled = user && course?.enrolledStudents?.includes(user._id)

  const handleEnroll = async () => {
    if (!user) return navigate('/login')
    if (user.role !== 'student') return toast.error('Only students can enroll')
    
    if (course.price > 0) {
      return navigate(`/checkout/${id}`)
    }

    setPurchasing(true)
    try {
      await purchaseCourse(id)
      dispatch(fetchCourse(id))
      navigate(`/student/watch/${id}`)
    } catch (err) {
      if (err.message !== 'Payment cancelled') toast.error('Enrollment failed')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading || !course) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex gap-3 mb-6">
              <span className="bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-primary-100 dark:border-primary-800">{course.category}</span>
              <span className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800">{course.level}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">{course.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">{course.description}</p>

            <div className="flex flex-wrap items-center gap-6 mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-accent-500 text-lg">★</span>
                <span className="text-sm font-bold dark:text-white">{course.averageRating || '4.8'}</span>
                <span className="text-xs text-gray-400">(Professional Rating)</span>
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span className="text-sm font-bold dark:text-white">{course.enrolledStudents?.length || 0}</span>
                <span className="text-xs text-gray-400">Students Enrolled</span>
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🎬</span>
                <span className="text-sm font-bold dark:text-white">{course.lectures?.length || 0}</span>
                <span className="text-xs text-gray-400">Premium Sessions</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <img
              src={course.faculty?.avatar ? `${API_URL}${course.faculty.avatar}` : `https://ui-avatars.com/api/?name=${course.faculty?.name}&background=82308E&color=fff`}
              alt={course.faculty?.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-100 dark:border-primary-900 shadow-md transition-transform group-hover:scale-110"
            />
            <div>
              <p className="text-lg font-black text-gray-900 dark:text-white">{course.faculty?.name}</p>
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">Master Instructor</p>
            </div>
          </div>

          {/* What You'll Learn */}
          {course.whatYouLearn?.length > 0 && (
            <div className="card !p-10">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 border-l-4 border-accent-500 pl-4 uppercase tracking-tight">Main Learning Outcomes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.whatYouLearn.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <span className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum */}
          <div className="card">
            <h2 className="text-xl font-bold dark:text-white mb-4">Course Curriculum</h2>
            {course.lectures?.length === 0 ? (
              <p className="text-gray-500">No lectures added yet</p>
            ) : (
              <div className="space-y-2">
                {course.lectures?.map((lecture, i) => (
                  <div key={lecture._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium dark:text-white">{lecture.title}</span>
                      {lecture.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Free</span>}
                    </div>
                    <span className="text-xs text-gray-500">{Math.floor(lecture.duration / 60)} min</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-32 !p-6">
            <div className="relative h-56 rounded-2xl overflow-hidden mb-8 shadow-xl">
               <img
                  src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/400x200/82308E/white?text=SkillMaster'}
                  alt={course.title}
                  className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">One-time Investment</p>
                   <p className="text-4xl font-black text-primary-600">
                    {course.price === 0 ? 'FREE' : `₹${course.price}`}
                   </p>
                </div>
                {course.price > 0 && (
                   <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 line-through">₹{Math.round(course.price * 1.5)}</p>
                      <p className="text-xs font-black text-accent-600 bg-accent-50 px-2 py-1 rounded-lg">33% OFF</p>
                   </div>
                )}
              </div>

              {isEnrolled ? (
                <button onClick={() => navigate(`/student/watch/${id}`)} className="w-full btn-primary !py-5 !rounded-2xl text-lg shadow-2xl flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-transform font-black">
                   Continue Learning <span className="animate-pulse">→</span>
                </button>
              ) : (
                <button onClick={handleEnroll} disabled={purchasing} className="w-full btn-primary !py-5 !rounded-2xl text-lg shadow-2xl flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-transform font-black">
                   {purchasing ? 'Processing...' : course.price === 0 ? 'Enroll Now Free' : 'Secure Admission Now'}
                </button>
              )}

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">This program includes:</p>
                 <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3 font-semibold">
                  <li className="flex gap-3 items-center">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 flex items-center justify-center rounded-lg text-[10px]">✔</span>
                    Duration: {course.totalDuration || 'Self-paced'}
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 flex items-center justify-center rounded-lg text-[10px]">✔</span>
                    Full lifetime access to HD content
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 flex items-center justify-center rounded-lg text-[10px]">✔</span>
                    Digital certificate of completion
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 flex items-center justify-center rounded-lg text-[10px]">✔</span>
                    Direct support from instructors
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 flex items-center justify-center rounded-lg text-[10px]">✔</span>
                    Mobile & desktop ready player
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
