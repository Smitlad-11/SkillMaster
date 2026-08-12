import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourse } from '../../redux/slices/courseSlice'
import { purchaseCourse } from '../../services/paymentService'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import getImageUrl from '../../utils/getImageUrl';

const API_URL = 'http://localhost:5000'

const Checkout = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { course, loading } = useSelector(state => state.courses)
  const { user } = useSelector(state => state.auth)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchCourse(id))
    }
  }, [id, dispatch])

  // Redirect if already enrolled
  useEffect(() => {
    if (user && course?.enrolledStudents?.includes(user._id)) {
      navigate(`/student/watch/${id}`)
    }
  }, [user, course, id, navigate])

  const handlePayment = async () => {
    if (!user) return navigate('/login')
    setIsProcessing(true)
    try {
      const result = await purchaseCourse(id)
      if (result.success) {
        // Enforce a small delay for better UX before navigating
        setTimeout(() => {
          navigate(`/student/watch/${id}`)
        }, 1500)
      }
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Payment failed. Please try again.';
        toast.error(errorMsg);
      }
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading || !course) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between px-2">
          <Link to={`/courses/${id}`} className="group flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-primary-600 transition-colors">
            <span className="mr-2 group-hover:-translate-x-2 transition-transform">←</span> Return to Course
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Gateway Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Course Summary */}
          <div className="lg:col-span-8 space-y-10">
            <div className="card !p-10 border-2 border-transparent hover:border-primary-100/50 transition-all shadow-premium">
               <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-full md:w-56 h-40 flex-shrink-0 relative">
                     <img 
                       src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/400x300/82308E/white?text=SkillMaster'}
                       className="w-full h-full object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform"
                     />
                     <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10"></div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] bg-primary-50 px-4 py-2 rounded-xl mb-4 inline-block">{course.category}</span>
                     <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 leading-tight">{course.title}</h1>
                     <div className="flex flex-wrap justify-center md:justify-start gap-6">
                        <div className="flex items-center gap-2">
                           <img src={`https://ui-avatars.com/api/?name=${course.faculty?.name}&background=82308E&color=fff`} className="w-6 h-6 rounded-full" />
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.faculty?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-lg">📽️</span>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.lectures?.length || 0} Exclusive Sessions</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Premium Inclusions */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight px-2">Elite <span className="text-primary-600">Learning Pass</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: '💎', title: 'Infinite Access', desc: 'Unrestricted lifetime entry to all course materials and future updates.' },
                    { icon: '📜', title: 'Global Certification', desc: 'Professional endorsement from SkillMaster upon program completion.' },
                    { icon: '🛠️', title: 'Dynamic Resources', desc: 'Downloadable assets, source code, and comprehensive case studies.' },
                    { icon: '💬', title: 'Direct Mentor Sync', desc: 'Priority access to faculty for complex concept clarification.' }
                  ].map((item, i) => (
                    <div key={i} className="card group !p-8 border-2 border-transparent hover:border-primary-100 transition-all">
                       <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                       <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 text-sm">{item.title}</h4>
                       <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-widest opacity-60">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Checkout Action Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="card !p-10 shadow-premium relative overflow-hidden bg-gray-900 text-white border-none">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 opacity-20 rounded-full blur-[40px]"></div>
               <h2 className="text-2xl font-black uppercase tracking-tight mb-10 pb-4 border-b border-white/10">Order <span className="text-primary-600">Summary</span></h2>
               
               <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest opacity-60">
                     <span>Investment</span>
                     <span>₹{course.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest opacity-60">
                     <span>Taxes & Processing</span>
                     <span className="text-green-500">Included</span>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Final Amount</span>
                        <div className="text-right">
                           <p className="text-4xl font-black text-white leading-none mb-1">₹{course.price.toLocaleString('en-IN')}</p>
                           <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Instant Lifetime Access</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full btn-primary !py-5 !bg-primary-600 !hover:bg-primary-500 !rounded-2xl text-lg font-black shadow-2xl transform active:scale-95 transition-all group"
                  >
                    {isProcessing ? 'Authenticating...' : (
                      <div className="flex items-center justify-center gap-3">
                         Complete Enrollment <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                      </div>
                    )}
                  </button>
                  <p className="text-center text-[9px] font-black text-gray-500 uppercase tracking-widest">Secured by Razorpay • 256-bit SSL Standard</p>
               </div>

               <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                  <span className="text-xl">🛡️</span>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-1">Trust Guarantee</p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-tight opacity-60">Your educational investment is protected. SkillMaster ensures premium content or 100% value assurance.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout;
