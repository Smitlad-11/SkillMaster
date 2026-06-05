// pages/faculty/ViewStudents.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import Spinner from '../../components/Spinner'

const ViewStudents = () => {
  const { courseId } = useParams()
  const [data, setData] = useState({ courseTitle: '', students: [] })
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    api.get(`/courses/${courseId}/students-progress`)
      .then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [courseId])

  if (loading) return <Spinner />

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2">Student <span className="text-primary-600">Insights</span></h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{data.courseTitle || 'Course Enrollment'}</p>
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/20 px-6 py-3 rounded-2xl border border-primary-100 dark:border-primary-800">
           <span className="text-xs font-black text-primary-600 uppercase tracking-widest">{data.students.length} Enrolled</span>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden border-2 border-gray-100 dark:border-gray-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              {['Student', 'Progress', 'Joined On', 'Actions'].map(h => (
                <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {data.students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {student.avatar ? (
                      <img src={`http://localhost:5000${student.avatar}`} className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-primary-500 transition-all" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                        {student.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white mb-0.5">{student.name}</p>
                      <p className="text-[10px] font-medium text-gray-500 tracking-tight">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 min-w-[200px]">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-1000 ease-out rounded-full ${student.progress === 100 ? 'bg-green-500' : 'bg-primary-600'}`}
                         style={{ width: `${student.progress}%` }}
                       />
                    </div>
                    <span className="text-[10px] font-black text-gray-900 dark:text-white w-8">{student.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[10px] font-bold text-gray-500 uppercase">
                  {new Date(student.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5">
                  <button 
                    onClick={() => setSelectedStudent(student)}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
            {data.students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                   <div className="text-4xl mb-4 opacity-20">👥</div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No students enrolled yet</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Header Decoration */}
              <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800" />
              
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors text-xl font-bold"
              >✕</button>

              <div className="px-10 pb-10 -mt-16 text-center">
                 <div className="relative inline-block mb-6">
                    {selectedStudent.avatar ? (
                      <img src={`http://localhost:5000${selectedStudent.avatar}`} className="w-32 h-32 rounded-3xl object-cover ring-8 ring-white dark:ring-gray-900 shadow-2xl mx-auto" />
                    ) : (
                      <div className="w-32 h-32 rounded-3xl bg-primary-600 flex items-center justify-center text-white text-4xl font-black ring-8 ring-white dark:ring-gray-900 shadow-2xl mx-auto uppercase">
                        {selectedStudent.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-gray-900" title="Active Student" />
                 </div>

                 <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">{selectedStudent.name}</h2>
                 <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-6">Enrolled Student</p>

                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-3xl text-left border border-gray-100 dark:border-gray-800">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</p>
                       <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{selectedStudent.email}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-3xl text-left border border-gray-100 dark:border-gray-800">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</p>
                       <p className="text-xs font-bold text-gray-900 dark:text-white">{selectedStudent.phone || 'Not provided'}</p>
                    </div>
                 </div>

                 <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl text-left border border-gray-100 dark:border-gray-800 mb-8">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">About Student</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                       "{selectedStudent.bio || 'This student has not added a bio yet.'}"
                    </p>
                 </div>

                 <div className="flex items-center justify-between px-2">
                    <div className="text-left">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Progress</p>
                       <p className="text-2xl font-black text-gray-900 dark:text-white">{selectedStudent.progress}%</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Activity</p>
                       <p className="text-xs font-bold text-gray-900 dark:text-white italic">
                          {selectedStudent.lastAccessed ? new Date(selectedStudent.lastAccessed).toLocaleDateString() : 'No activity yet'}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}

export default ViewStudents
