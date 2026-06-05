// pages/auth/Login.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector(state => state.auth)

  useEffect(() => {
    if (user) {
      const routes = { admin: '/admin', faculty: '/faculty', student: '/student' }
      navigate(routes[user.role] || '/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (error) toast.error(error)
    return () => dispatch(clearError())
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">S</div>
          <h1 className="text-2xl font-bold dark:text-white">Welcome Back!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your SkillMaster account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-500 font-medium">Forgot Password?</Link>
              </div>
              <input
                type="password" className="input" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 animate-shake">
                <span className="text-sm">⚠️</span>
                {error}
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-2.5" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary-600 hover:underline font-medium">Register</Link>
          </div>
          <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Have an inquiry? <Link to="/contact" className="text-primary-600 hover:underline font-medium">Contact Admin</Link>
          </div>

          {/* Quick login hints */}
          {/* <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs text-gray-500 dark:text-gray-400"> */}
          {/* </div> */}
        </div>
      </div>
    </div >
  )
}

export default Login
