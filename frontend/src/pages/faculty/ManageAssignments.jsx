import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const ManageAssignments = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  // Creation form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', maxMarks: 100, referenceLink: ''
  })
  const [file, setFile] = useState(null)

  // Grading form state
  const [gradingSubmission, setGradingSubmission] = useState(null)
  const [gradeData, setGradeData] = useState({ marks: '', feedback: '' })

  // Editing form state
  const [editingAssignmentId, setEditingAssignmentId] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: '', description: '', dueDate: '', maxMarks: 100, referenceLink: ''
  })
  const [editFile, setEditFile] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [courseRes, assignRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/assignments/course/${courseId}`)
      ])
      setCourse(courseRes.data)
      setAssignments(assignRes.data)
    } catch (err) {
      toast.error('Failed to load assignments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [courseId])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('courseId', courseId)
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('dueDate', formData.dueDate)
      data.append('maxMarks', formData.maxMarks)
      data.append('referenceLink', formData.referenceLink)
      if (file) data.append('file', file)

      await api.post('/assignments', data)
      toast.success('Assignment created!')
      setFormData({ title: '', description: '', dueDate: '', maxMarks: 100, referenceLink: '' })
      setFile(null)
      setShowCreateForm(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment')
    }
  }

  const handleUpdate = async (e, id) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('title', editFormData.title)
      data.append('description', editFormData.description)
      // Only append dueDate if it looks valid
      if (editFormData.dueDate) data.append('dueDate', editFormData.dueDate)
      data.append('maxMarks', editFormData.maxMarks)
      data.append('referenceLink', editFormData.referenceLink)
      if (editFile) data.append('file', editFile)

      await api.put(`/assignments/${id}`, data)
      toast.success('Assignment updated successfully!')
      setEditingAssignmentId(null)
      setEditFile(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update assignment')
    }
  }

  const submitGrade = async (assignmentId, studentId) => {
    try {
      await api.put(`/assignments/${assignmentId}/grade/${studentId}`, gradeData)
      toast.success('Grade submitted!')
      setGradingSubmission(null)
      fetchData()
    } catch (err) {
      toast.error('Failed to submit grade')
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/faculty/assignments" className="text-sm text-purple-600 hover:text-purple-700 font-medium mb-2 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-2xl font-bold dark:text-white">Assignments: {course?.title}</h1>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
          {showCreateForm ? 'Cancel' : '+ New Assignment'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 animate-fade-in text-sm">
          <h2 className="text-lg font-bold mb-4 dark:text-white">Create New Assignment</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Due Date</label>
                <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Description</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Max Marks</label>
                <input required type="number" min="1" value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Reference Link (Optional)</label>
                <input type="url" value={formData.referenceLink} onChange={e => setFormData({...formData, referenceLink: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Attachment (PDF/ZIP)</label>
              <input type="file" onChange={e => setFile(e.target.files[0])} accept=".pdf,.zip,.rar" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
            </div>
            <button type="submit" className="btn-primary mt-2">Publish Assignment</button>
          </form>
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-xl font-bold dark:text-white mb-2">No Assignments Yet</h2>
          <p className="text-gray-500">Create the first assignment for your students.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map(assign => (
            <div key={assign._id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              {editingAssignmentId === assign._id ? (
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-blue-50/10 dark:bg-gray-800">
                  <form onSubmit={(e) => handleUpdate(e, assign._id)} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-gray-700 dark:text-gray-300 mb-1 text-xs font-medium">Title</label>
                         <input required type="text" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                       </div>
                       <div>
                         <label className="block text-gray-700 dark:text-gray-300 mb-1 text-xs font-medium">Due Date</label>
                         <input required type="date" value={editFormData.dueDate} onChange={e => setEditFormData({...editFormData, dueDate: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                       </div>
                     </div>
                     <div>
                       <label className="block text-gray-700 dark:text-gray-300 mb-1 text-xs font-medium">Description</label>
                       <textarea required rows="2" value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-gray-700 dark:text-gray-300 mb-1 text-xs font-medium">Max Marks</label>
                         <input required type="number" min="1" value={editFormData.maxMarks} onChange={e => setEditFormData({...editFormData, maxMarks: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                       </div>
                       <div>
                         <label className="block text-gray-700 dark:text-gray-300 mb-1 text-xs font-medium">Reference Link</label>
                         <input type="url" value={editFormData.referenceLink} onChange={e => setEditFormData({...editFormData, referenceLink: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                       </div>
                     </div>
                     <div>
                       <label className="block text-gray-700 dark:text-gray-300 mb-1 text-xs font-medium">Replace Attachment (Optional)</label>
                       <input type="file" onChange={e => setEditFile(e.target.files[0])} accept=".pdf,.zip,.rar" className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                     </div>
                     <div className="flex gap-2 justify-end">
                       <button type="button" onClick={() => setEditingAssignmentId(null)} className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded text-gray-800">Cancel</button>
                       <button type="submit" className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">Save Changes</button>
                     </div>
                  </form>
                </div>
              ) : (
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold dark:text-white">{assign.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{assign.description}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="block text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-1">{assign.maxMarks} Marks</span>
                      <span className="block text-xs text-gray-500">Due: {new Date(assign.dueDate).toLocaleDateString()}</span>
                      <button onClick={() => {
                          setEditingAssignmentId(assign._id);
                          setEditFormData({
                            title: assign.title, description: assign.description, dueDate: assign.dueDate.split('T')[0], maxMarks: assign.maxMarks, referenceLink: assign.referenceLink || ''
                          });
                          setEditFile(null);
                      }} className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 font-medium bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">Edit Details</button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-0">
                {assign.submissions?.length === 0 ? (
                  <p className="p-5 text-sm text-gray-500 italic text-center">No submissions yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Student</th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Submitted At</th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">File</th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                        <th className="text-center px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {assign.submissions.map(sub => (
                        <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
                          <td className="px-5 py-4 dark:text-white font-medium">Student UUID: {sub.student?.substring(0, 8)}</td>
                          <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{new Date(sub.submittedAt).toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-1">
                              {sub.fileUrl ? (
                                <a href={`http://localhost:5000${sub.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-xs flex items-center gap-1" title="Download File">📄 View Proof</a>
                              ) : <span className="text-gray-400 text-xs">No file</span>}
                              {sub.link && (
                                <a href={sub.link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-xs flex items-center gap-1" title="External Link">🔗 View Link</a>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {sub.status === 'graded' ? `Graded: ${sub.marks}/${assign.maxMarks}` : 'Pending'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {gradingSubmission === sub._id ? (
                              <div className="flex flex-col gap-2 items-end">
                                <div className="flex gap-2 w-full">
                                  <input type="number" placeholder="Marks" value={gradeData.marks} onChange={e => setGradeData({...gradeData, marks: e.target.value})} className="w-20 px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                                  <input type="text" placeholder="Brief Feedback" value={gradeData.feedback} onChange={e => setGradeData({...gradeData, feedback: e.target.value})} className="flex-1 px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => submitGrade(assign._id, sub.student)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">Save</button>
                                  <button onClick={() => setGradingSubmission(null)} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded text-xs">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => {
                                setGradingSubmission(sub._id);
                                setGradeData({ marks: sub.marks || '', feedback: sub.feedback || '' });
                              }} className="text-purple-600 hover:text-purple-800 font-medium text-xs">
                                {sub.status === 'graded' ? 'Edit Grade' : 'Grade Submission'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageAssignments
