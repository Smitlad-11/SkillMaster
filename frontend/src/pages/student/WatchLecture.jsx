// pages/student/WatchLecture.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import api from '../../services/api'
import ProgressBar from '../../components/ProgressBar'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000'

const WatchLecture = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lectures, setLectures] = useState([])
  const [currentLecture, setCurrentLecture] = useState(null)
  const [progress, setProgress] = useState({ percentage: 0, completedLectures: [] })
  const [loading, setLoading] = useState(true)
  const [queries, setQueries] = useState([])
  const [isQAModalOpen, setIsQAModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lectureRes, progressRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/lectures/course/${courseId}`),
          api.get(`/progress/${courseId}`),
        ])
        setCourse(courseRes.data)
        setLectures(lectureRes.data)
        setCurrentLecture(lectureRes.data[0] || null)
        setProgress(progressRes.data)
        const queryRes = await api.get(`/queries/course/${courseId}`)
        setQueries(queryRes.data)
      } catch { }
      setLoading(false)
    }
    fetchData()
  }, [courseId])


  const refreshQueries = async () => {
    try {
      const { data } = await api.get(`/queries/course/${courseId}`)
      setQueries(data)
    } catch { }
  }

  const markComplete = async (lectureId) => {
    try {
      const { data } = await api.put('/progress/update', { courseId, lectureId })
      setProgress(data)
      if (data.completed) toast.success('🎉 Course completed! Certificate generated!')
      else toast.success('Lecture marked complete!')
    } catch { toast.error('Failed to update progress') }
  }

  const isCompleted = (lectureId) =>
    progress.completedLectures?.some(l => (l._id || l) === lectureId)

  if (loading) return <Spinner />

  return (
    <div className="flex h-[calc(100vh-64px)] dark:bg-gray-900 border-t dark:border-gray-800">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto flex-shrink-0 custom-scrollbar">
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
          <h2 className="font-bold text-sm dark:text-white line-clamp-2 leading-tight">{course?.title}</h2>
          <div className="mt-4">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Course Progress</span>
              <span className="text-[10px] font-black text-gray-900 dark:text-white">{progress.percentage}%</span>
            </div>
            <ProgressBar percentage={progress.percentage} />
          </div>
          {progress.certificateUrl && (
            <a href={`${API_URL}${progress.certificateUrl}`} target="_blank" rel="noreferrer"
              className="mt-4 block text-center bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-xl transition shadow-lg shadow-green-500/20">
              🏆 Download Certificate
            </a>
          )}
        </div>
        <div className="p-3 space-y-1">
          {lectures.map((lecture, i) => (
            <button
              key={lecture._id}
              onClick={() => setCurrentLecture(lecture)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 ${currentLecture?._id === lecture._id
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-100 dark:border-primary-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${isCompleted(lecture._id) ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  }`}>
                  {isCompleted(lecture._id) ? '✓' : i + 1}
                </div>
                <div>
                  <p className="text-xs font-bold dark:text-white leading-snug">{lecture.title}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">{Math.floor(lecture.duration / 60)} minutes</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {currentLecture ? (
          <>
            {/* Video Player Section */}
            <div className="bg-black aspect-video w-full flex-shrink-0 shadow-2xl relative z-10">
              <ReactPlayer
                url={currentLecture.videoUrl?.startsWith('http') ? currentLecture.videoUrl : `${API_URL}${currentLecture.videoUrl}`}
                width="100%" height="100%"
                controls playing={false}
              />
            </div>

            {/* Information Section */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-5xl mx-auto p-8 lg:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b dark:border-gray-800 pb-12">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-[9px] font-black text-primary-600 uppercase tracking-widest">Selected Lecture</span>
                      <span className="h-px w-8 bg-gray-200 dark:bg-gray-700"></span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{currentLecture.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-medium leading-relaxed max-w-2xl">{currentLecture.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 flex-shrink-0">
                    <button onClick={() => setIsQAModalOpen(true)}
                      className="btn-accent !px-8 !py-4 shadow-xl shadow-accent-500/20 flex items-center gap-2 transform hover:-translate-y-1 transition-all">
                      💬 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Q & A Section</span>
                    </button>

                    {currentLecture.pdfUrl && (
                      <a href={currentLecture.pdfUrl?.startsWith('http') ? currentLecture.pdfUrl : `${API_URL}${currentLecture.pdfUrl}`} target="_blank" rel="noreferrer"
                        className="btn-secondary !px-8 !py-4 shadow-premium flex items-center gap-2 hover:bg-white dark:hover:bg-gray-700">
                        📄 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Study Material</span>
                      </a>
                    )}

                    {!isCompleted(currentLecture._id) && (
                      <button onClick={() => markComplete(currentLecture._id)}
                        className="btn-primary !px-8 !py-4 shadow-2xl shadow-primary-500/30 flex items-center gap-2 transform hover:-translate-y-1 transition-all">
                        ✓ <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mark as Complete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/*                <div className="mt-12 opacity-50 text-center py-20 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Lecture Resources & Community Discussions</p>
                </div>*/}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-pulse">
              <div className="text-8xl mb-8 filter grayscale opacity-20">🎬</div>
              <p className="font-black uppercase tracking-[0.5em] text-xs text-gray-400">Select a lecture to proceed</p>
            </div>
          </div>
        )}

        {/* Q&A Modal Overlay */}
        {isQAModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] w-full max-w-xl shadow-3xl overflow-hidden animate-slide-up border border-white/10">
              <div className="p-8 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-2xl shadow-inner">💬</div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Support & <span className="text-primary-600">Q&A</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Direct Help from Instructors</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsQAModalOpen(false)}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all text-gray-400"
                >✕</button>
              </div>

              <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Form Section */}
                <div className="bg-gray-50 dark:bg-gray-900/40 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-inner">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const question = e.target.question.value;
                    if (!question) return;
                    try {
                      await api.post('/queries', { courseId, question });
                      toast.success('Query sent successfully!');
                      e.target.reset();
                      refreshQueries();
                    } catch { toast.error('Failed to send query'); }
                  }} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 block ml-1">Submit a New Doubt</label>
                      <textarea
                        name="question"
                        className="input !py-5 !px-8 min-h-[140px] !rounded-[1.5rem] text-sm shadow-sm border-none bg-white dark:bg-gray-800"
                        placeholder="What are you struggling with?"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary !py-5 w-full !text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/30 transform hover:-translate-y-1 transition-all"
                    >Send Question to Faculty</button>
                  </form>
                </div>

                {/* History Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Recent Discussions</h4>
                    <span className="h-px w-full bg-gray-100 dark:bg-gray-800"></span>
                  </div>

                  {queries.length === 0 ? (
                    <div className="text-center py-12 opacity-30">
                      <p className="text-xs font-bold uppercase tracking-[0.2em]">No history found</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {queries.map((q) => (
                        <div key={q._id} className="p-6 rounded-[2rem] bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-500 group">
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors">{q.question}</p>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${q.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
                              }`}>
                              {q.status}
                            </span>
                          </div>
                          {q.answer && (
                            <div className="mt-5 p-5 rounded-2xl bg-primary-50/50 dark:bg-primary-900/10 border-l-4 border-primary-600 animate-fade-in">
                              <p className="text-[9px] font-black text-primary-600 uppercase tracking-[0.2em] mb-2">Faculty Answer</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{q.answer}</p>
                            </div>
                          )}
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Sent {new Date(q.createdAt).toLocaleDateString()}</p>
                            <div className="h-1 w-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-5 bg-gray-50/50 dark:bg-gray-900/30 text-center border-t dark:border-gray-700">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Instructors usually respond within few hours</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WatchLecture
