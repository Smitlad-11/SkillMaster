import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import getImageUrl from '../../utils/getImageUrl'



const StudentAssignments = () => {
  const { user } = useSelector(state => state.auth)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitFile, setSubmitFile] = useState(null)
  const [submitLink, setSubmitLink] = useState('')
  const [activeUpload, setActiveUpload] = useState(null)

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/assignments/my')
      setAssignments(data)
    } catch (err) {
      toast.error('Failed to load assignments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAssignments() }, [])

  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault()
    if (!submitFile && !submitLink.trim()) return toast.error('Please submit either a file or a link.')

    const formData = new FormData()
    if (submitFile) formData.append('file', submitFile)
    if (submitLink.trim()) formData.append('link', submitLink.trim())

    try {
      await api.post(`/assignments/${assignmentId}/submit`, formData)
      toast.success('Assignment submitted successfully!')
      setSubmitFile(null)
      setSubmitLink('')
      setActiveUpload(null)
      fetchAssignments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit assignment')
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Assignments</h1>
        <p className="text-gray-500">View and submit assignments for your enrolled courses</p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-3xl shadow-sm border border-dashed border-gray-200 dark:border-gray-700">
          <div className="text-7xl mb-6 opacity-80">📝</div>
          <h2 className="text-2xl font-bold dark:text-white mb-3">No Assignments Yet</h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto">Your instructors haven't posted any assignments yet. Check back later!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {assignments.map(assign => {
            // Find student's own submission status if one exists
            const mySubmission = assign.submissions?.find(s => s.student.toString() === user?._id?.toString() || s.student?._id?.toString() === user?._id?.toString())
            const isLate = new Date() > new Date(assign.dueDate)

            return (
              <div key={assign._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="flex flex-col md:flex-row">
                  {/* Left Column: Course Context */}
                  <div className="md:w-56 bg-gray-50/50 dark:bg-gray-800/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="w-20 h-20 mb-4 rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 bg-white dark:bg-gray-700 transition-transform group-hover:scale-105 duration-500">
                      <img
                        src={assign.course?.thumbnail ? getImageUrl(assign.course.thumbnail) : 'https://placehold.co/200x200/2563EB/ffffff?text=C'}
                        alt={assign.course?.title || 'Course'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-center text-sm leading-tight balance">{assign.course?.title || 'Unknown Course'}</h4>
                    <p className="text-xs text-gray-500 mt-2 font-medium bg-white dark:bg-gray-700 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-600">
                      By {assign.faculty?.name || 'Instructor'}
                    </p>
                  </div>
                  
                  {/* Right Column: Assignment Details */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2 tracking-tight">{assign.title}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-md ${isLate ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Due: {new Date(assign.dueDate).toLocaleDateString()} {isLate && <span className="text-red-600 font-bold ml-1">(Overdue)</span>}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="inline-flex items-center justify-center font-bold text-gray-700 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm">
                          {assign.maxMarks} <span className="text-gray-400 font-medium ml-1">pts</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{assign.description}</p>
                    </div>
                    
                    {/* Resources */}
                    {(assign.referenceLink || assign.fileUrl) && (
                      <div className="mb-6 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
                        <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          Resources
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {assign.referenceLink && (
                             <a href={assign.referenceLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800/50 hover:shadow-md hover:-translate-y-0.5 transition-all">
                               <span>🔗</span> External Link
                             </a>
                          )}
                          {assign.fileUrl && (
                             <a
                                href={getImageUrl(assign.fileUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
                              >
                                <span>📄</span> Download File
                              </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Submission Area */}
                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                      {mySubmission ? (
                        <div className={`relative overflow-hidden p-5 rounded-2xl border ${mySubmission.status === 'graded' ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600'}`}>
                          {/* Accent line */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${mySubmission.status === 'graded' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pl-2">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Your Submission
                                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${mySubmission.status === 'graded' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                                  {mySubmission.status === 'graded' ? 'Graded ✓' : 'Under Review ⏳'}
                                </span>
                              </h4>
                              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Submitted {new Date(mySubmission.submittedAt).toLocaleString()}</p>
                            </div>
                            
                            <div className="flex gap-2 shrink-0">
                              {mySubmission.fileUrl && (
                                <a
                                  href={getImageUrl(mySubmission.fileUrl)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-300"
                                >
                                  View File
                                </a>
                              )}
                              {mySubmission.link && (
                                <a href={mySubmission.link} target="_blank" rel="noreferrer" className="text-sm px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-gray-300">
                                  View Link
                                </a>
                              )}
                            </div>
                          </div>

                          {mySubmission.status === 'graded' && (
                            <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-green-800/50 ml-2">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold text-lg">
                                  {mySubmission.marks}
                                </span>
                                <span className="text-sm text-gray-500 font-medium">out of {assign.maxMarks} points</span>
                              </div>
                              {mySubmission.feedback && (
                                <div className="mt-3 pl-4 border-l-2 border-green-200 dark:border-green-700 text-sm text-gray-700 dark:text-gray-300 italic">
                                  "{mySubmission.feedback}"
                                </div>
                              )}
                            </div>
                          )}
                          
                          {mySubmission.status !== 'graded' && (
                             <button onClick={() => setActiveUpload(assign._id)} className="mt-2 ml-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline inline-flex items-center gap-1">
                               Resubmit Assignment &rarr;
                             </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 dark:bg-gray-800/30 p-5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                          <div className="mb-4 sm:mb-0">
                            <h4 className="font-bold text-gray-800 dark:text-gray-200">Ready to submit?</h4>
                            <p className="text-sm text-gray-500 mt-0.5">Upload your work before the deadline.</p>
                          </div>
                          <button onClick={() => setActiveUpload(assign._id)} className="btn-primary py-2.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 shrink-0 font-bold">
                            Submit Work
                          </button>
                        </div>
                      )}

                      {/* Submission Upload Form */}
                      {activeUpload === assign._id && (
                        <form onSubmit={(e) => handleSubmit(e, assign._id)} className="mt-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-primary-100 dark:border-gray-600 shadow-lg animate-fade-in ring-1 ring-primary-500/20">
                          <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">New Submission</h4>
                          
                          <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload File (PDF/ZIP)</label>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-bold">Click to upload</span> or drag and drop</p>
                                  {submitFile && <p className="text-sm font-bold text-primary-600">{submitFile.name}</p>}
                                </div>
                                <input type="file" className="hidden" onChange={e => setSubmitFile(e.target.files[0])} accept=".pdf,.zip,.rar" />
                              </label>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex items-center gap-4 mb-2">
                              <hr className="flex-1 border-gray-200 dark:border-gray-600" />
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
                              <hr className="flex-1 border-gray-200 dark:border-gray-600" />
                            </div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">External Link</label>
                            <input type="url" placeholder="https://github.com/..." value={submitLink} onChange={e => setSubmitLink(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-shadow" />
                          </div>
                          
                          <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => { setActiveUpload(null); setSubmitLink(''); setSubmitFile(null); }} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">Submit Assignment</button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StudentAssignments
