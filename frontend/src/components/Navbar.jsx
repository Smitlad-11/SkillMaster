// components/Navbar.jsx

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { logout } from '../redux/slices/authSlice'
import { toggleDarkMode } from '../redux/slices/uiSlice'
import getImageUrl from '../utils/getImageUrl'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user } = useSelector(state => state.auth)
  const { darkMode } = useSelector(state => state.ui)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const dashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'admin') return '/admin'
    if (user.role === 'faculty') return '/faculty'
    return '/student'
  }

  // Check if current route is a dashboard route
  const isDashboard = ['/admin', '/faculty', '/student'].some(path =>
    location.pathname.startsWith(path)
  )

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const mobileNavigate = (path) => {
    setMobileMenuOpen(false)
    navigate(path)
  }

  return (
    <nav className="glass sticky top-0 z-[100] border-b border-gray-100 dark:border-gray-800 shadow-premium backdrop-blur-[20px] bg-white/80 dark:bg-gray-900/80">

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 lg:h-24 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 lg:gap-4 group"
        >
          <div className="w-11 h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            S
          </div>

          <div className="flex flex-col">
            <span className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tighter uppercase group-hover:text-primary-600 transition-colors">
              Skill<span className="text-primary-600">Master</span>
            </span>

            <span className="text-[8px] lg:text-[9px] font-black text-primary-500 uppercase tracking-[0.3em] leading-none mt-1">
              International Standard
            </span>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden lg:flex items-center gap-12">

          {!isDashboard && (
            <div className="flex items-center gap-10">
              {['Home', 'Programs', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={
                    item === 'Programs'
                      ? '/courses'
                      : item === 'Home'
                        ? '/'
                        : `/${item.toLowerCase()}`
                  }
                  className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] hover:text-primary-600 transition-all relative group"
                >
                  {item}

                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6">

            {/* Dark Mode */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xl"
            >
              {darkMode ? '🌤️' : '🌙'}
            </button>

            {/* Logged In */}
            {user ? (
              <div className="flex items-center gap-6 pl-6 border-l border-gray-100 dark:border-gray-800">

                <Link
                  to={dashboardLink()}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {user.name}
                    </p>

                    <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mt-0.5 opacity-80">
                      {user.role}
                    </p>
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
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    🚪
                  </span>

                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest px-8 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all"
                >
                  Portal Access
                </Link>

                <Link
                  to="/register"
                  className="btn-primary !px-10 !py-4 shadow-2xl"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ================= MOBILE RIGHT SIDE ================= */}
        <div className="flex lg:hidden items-center gap-2">

          {/* Dark Mode */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-lg"
          >
            {darkMode ? '🌤️' : '🌙'}
          </button>

          {/* Logged-in user avatar on mobile */}
          {user && (
            <Link
              to={dashboardLink()}
              onClick={closeMobileMenu}
              className="ml-1"
            >
              {user.avatar ? (
                <img
                  src={getImageUrl(user.avatar)}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-100 dark:ring-primary-900/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-white text-sm uppercase">
                  {user.name?.charAt(0)}
                </div>
              )}
            </Link>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">

          <div className="px-5 py-5 space-y-2">

            {/* Public Navigation */}
            {!isDashboard && (
              <>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-all"
                >
                  Home
                </Link>

                <Link
                  to="/courses"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-all"
                >
                  Programs
                </Link>

                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-all"
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-all"
                >
                  Contact
                </Link>
              </>
            )}

            {/* Logged Out Mobile Options */}
            {!user ? (
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-3 rounded-xl border border-primary-100 dark:border-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-black uppercase tracking-widest hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                >
                  Login / Portal Access
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="btn-primary w-full !py-3 text-center block"
                >
                  Register Free
                </Link>
              </div>
            ) : (
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">

                {/* Mobile User Info */}
                <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase">
                    {user.name}
                  </p>

                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">
                    {user.role}
                  </p>
                </div>

                {/* Dashboard */}
                <button
                  onClick={() => mobileNavigate(dashboardLink())}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-all"
                >
                  Dashboard
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar