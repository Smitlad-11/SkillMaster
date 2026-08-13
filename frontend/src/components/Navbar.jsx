import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { toggleDarkMode } from '../redux/slices/uiSlice'
import getImageUrl from '../utils/getImageUrl';

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)
  const { darkMode } = useSelector(state => state.ui)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const dashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'admin') return '/admin'
    if (user.role === 'faculty') return '/faculty'
    return '/student'
  }

  // Check if current route is a dashboard route
  const isDashboard = ['/admin', '/faculty', '/student'].some(path => location.pathname.startsWith(path))

  return (
    <nav className="glass sticky top-0 z-[100] border-b border-gray-100 dark:border-gray-800 shadow-premium backdrop-blur-[20px] bg-white/80 dark:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">S</div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tighter uppercase group-hover:text-primary-600 transition-colors">Skill<span className="text-primary-600">Master</span></span>
            <span className="text-[9px] font-black text-primary-500 uppercase tracking-[0.3em] leading-none mt-1">International Standard</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-12">
          {!isDashboard && (
            <div className="flex items-center gap-10">
              {['Home', 'Programs', 'About', 'Contact'].map((item) => (
                <Link 
                  key={item} 
                  to={item === 'Programs' ? '/courses' : item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] hover:text-primary-600 transition-all relative group"
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          )}


          <div className="flex items-center gap-6">
            <button 
              onClick={() => dispatch(toggleDarkMode())} 
              className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xl"
            >
              {darkMode ? '🌤️' : '🌙'}
            </button>

            {user ? (
               <div className="flex items-center gap-6 pl-6 border-l border-gray-100 dark:border-gray-800">
                  <Link to={dashboardLink()} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                     <div className="text-right">
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                        <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mt-0.5 opacity-80">{user.role}</p>
                     </div>
                     {user.avatar ? (
                       <img
                          src={getImageUrl(user.avatar)}
                          alt={user.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-4 ring-primary-50 dark:ring-primary-900/20"
                          />
                     ) : (
                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-white text-lg shadow-xl uppercase">
                         {user.name?.charAt(0)}
                       </div>
                     )}
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    title="Logout Session"
                    className="h-12 px-5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-600/10 group active:scale-95"
                  >
                     <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                  </button>
               </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest px-8 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all">Portal Access</Link>
                <Link to="/register" className="btn-primary !px-10 !py-4 shadow-2xl">Register Free</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
