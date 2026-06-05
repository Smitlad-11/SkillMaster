// pages/admin/ManageUsers.jsx
import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'
import { validatePassword } from '../../utils/validatePassword'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', bio: '', phone: '' })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (search) params.append('search', search)
      if (role) params.append('role', role)
      const { data } = await api.get(`/users?${params}`)
      setUsers(data.users)
      setPages(data.pages)
    } catch { }
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [page, role])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const toggleBlock = async (id, name, isBlocked) => {
    if (!confirm(`${isBlocked ? 'Unblock' : 'Block'} ${name}?`)) return
    try {
      await api.put(`/users/${id}/block`)
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'}`)
      fetchUsers()
    } catch { toast.error('Failed to update user') }
  }

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch { toast.error('Failed to delete user') }
  }

  const openAddModal = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'student', bio: '', phone: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, password: '', role: user.role, bio: user.bio || '', phone: user.phone || '' })
    setIsModalOpen(true)
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        const payload = { ...formData }
        if (!payload.password) {
          delete payload.password
        } else {
          const passwordCheck = validatePassword(payload.password);
          if (!passwordCheck.isValid) {
            return toast.error(passwordCheck.message);
          }
        }
        await api.put(`/users/${editingUser._id}`, payload)
        toast.success('User updated successfully')
      } else {
        const passwordCheck = validatePassword(formData.password);
        if (!passwordCheck.isValid) {
          return toast.error(passwordCheck.message);
        }
        await api.post('/users', formData)
        toast.success('User created successfully')
      }
      setIsModalOpen(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user')
    }
  }

  const roleColors = { admin: 'bg-red-100 text-red-700', faculty: 'bg-purple-100 text-purple-700', student: 'bg-blue-100 text-blue-700' }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Manage Users</h1>
        <button onClick={openAddModal} className="btn-primary px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all font-bold">+ Add User</button>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
          <input type="text" className="input flex-1 min-w-48" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input w-40" value={role} onChange={e => { setRole(e.target.value); setPage(1) }}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>
      </div>

      {loading ? <Spinner /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Name', 'Contact', 'Role', 'Status', 'Bio', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      <div>{u.email}</div>
                      {u.phone && <div className="text-xs text-gray-400 mt-0.5" title="Phone">📞 {u.phone}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs max-w-xs truncate" title={u.bio}>
                      {u.bio || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(u)} className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium transition-colors">Edit</button>
                        {u.role !== 'admin' && (
                          <button onClick={() => toggleBlock(u._id, u.name, u.isBlocked)}
                            className={`text-xs px-3 py-1 rounded ${u.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button onClick={() => deleteUser(u._id, u.name)}
                            className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${page === p ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold dark:text-white">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transform hover:scale-110 transition-all text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input w-full" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input w-full" placeholder="john@example.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Role *</label>
                  <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input w-full">
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{editingUser ? 'New Password (Optional)' : 'Password *'}</label>
                  <input type="password" required={!editingUser} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="input w-full" placeholder={editingUser ? "Leave blank to keep same" : "Min 8 chars, A-Z, 0-9, symbol"} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone (Optional)</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input w-full" placeholder="+1234567890" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Bio (Optional)</label>
                  <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="input w-full min-h-[80px]" placeholder="Brief professional background..."></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2.5 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 font-bold">
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
