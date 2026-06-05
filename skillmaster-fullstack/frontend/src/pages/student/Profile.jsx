import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000'

const Profile = () => {
  const { user, loading } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `${API_URL}${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name}&background=2563EB&color=fff`
  )
  const [avatarFile, setAvatarFile] = useState(null)
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const updateData = new FormData()
    updateData.append('name', formData.name)
    updateData.append('email', formData.email)
    updateData.append('phone', formData.phone)
    updateData.append('bio', formData.bio)
    
    if (avatarFile) {
      updateData.append('avatar', avatarFile)
    }

    try {
      const resultAction = await dispatch(updateProfile(updateData))
      if (updateProfile.fulfilled.match(resultAction)) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error(resultAction.payload || 'Failed to update profile')
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-3xl">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Update your personal details and public profile.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Avatar Update */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <img 
                  src={avatarPreview} 
                  alt="Profile Avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transition"
                  title="Change Avatar"
                >
                  📷
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              <p className="text-xs text-gray-500">JPG, GIF, or PNG. Max 1MB.</p>
            </div>

            {/* Profile Fields */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a little about yourself..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-shadow resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-6 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 -mx-6 -mb-6 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
