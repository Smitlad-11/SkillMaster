// pages/faculty/ManageQueries.jsx
import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const ManageQueries = () => {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [answer, setAnswer] = useState('')

  const fetchQueries = async () => {
    try {
      const { data } = await api.get('/queries/faculty')
      setQueries(data)
    } catch { }
    setLoading(false)
  }

  useEffect(() => { fetchQueries() }, [])

  const handleAnswer = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/queries/${selectedQuery._id}/answer`, { answer })
      toast.success('Response sent to student')
      setSelectedQuery(null)
      setAnswer('')
      fetchQueries()
    } catch { toast.error('Failed to send response') }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <div>
         <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 uppercase">Student <span className="text-primary-600">Queries</span></h1>
         <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Resolve student doubts and provide guidance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          {queries.length === 0 ? (
            <div className="card text-center !p-20 text-gray-400 font-bold uppercase tracking-widest text-xs opacity-50">No pending queries found</div>
          ) : (
            queries.map(q => (
              <button 
                key={q._id} 
                onClick={() => { setSelectedQuery(q); setAnswer(q.answer || '') }}
                className={`w-full text-left card !p-6 border-2 transition-all ${
                  selectedQuery?._id === q._id ? 'border-primary-600 bg-primary-50/10' : 'border-transparent hover:border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                     q.isResolved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                   }`}>
                     {q.isResolved ? 'Resolved' : 'Pending'}
                   </span>
                   <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">{q.course?.title}</p>
                <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2">{q.question}</h4>
                <p className="text-[10px] font-bold text-gray-400 mt-2">From: {q.student?.name}</p>
              </button>
            ))
          )}
        </div>

        <div>
          {selectedQuery ? (
            <div className="card !p-8 sticky top-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">Response <span className="text-primary-600">Portal</span></h3>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl mb-8 border border-gray-100 dark:border-gray-700">
                 <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-2">Question</p>
                 <p className="font-bold text-gray-800 dark:text-gray-200 italic">"{selectedQuery.question}"</p>
              </div>

              <form onSubmit={handleAnswer} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Your Answer</label>
                    <textarea 
                      className="input !py-4 min-h-[200px]" 
                      placeholder="Write your detailed explanation here..."
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      required
                    />
                 </div>
                 <button type="submit" className="btn-primary w-full !py-4 shadow-xl">
                    {selectedQuery.isResolved ? 'Update Response' : 'Post Final Answer'}
                 </button>
              </form>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center card !bg-gray-50 dark:!bg-gray-800/30 border-dashed border-2">
               <div className="text-center opacity-30">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="font-black uppercase tracking-widest text-[10px]">Select a query to resolve</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageQueries
