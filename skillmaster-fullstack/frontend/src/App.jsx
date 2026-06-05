// App.jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import About from './pages/public/About'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Contact from './pages/public/Contact'
import CourseBrowser from './pages/student/CourseBrowser'
import CourseDetail from './pages/student/CourseDetail'
import Checkout from './pages/student/Checkout'
import NotFound from './pages/NotFound'


import AdminLayout from './layouts/AdminLayout'
import FacultyLayout from './layouts/FacultyLayout'
import StudentLayout from './layouts/StudentLayout'

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
    <div className="text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold dark:text-white">Access Denied</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">You don't have permission to view this page.</p>
    </div>
  </div>
)

function App() {
  const { darkMode } = useSelector(state => state.ui)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Hide footer on dashboard routes
  const hiddenFooterRoutes = ['/admin', '/faculty', '/student']
  const showFooter = !hiddenFooterRoutes.some(r => location.pathname.startsWith(r))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<CourseBrowser />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/checkout/:id" element={<ProtectedRoute allowedRoles={['student']}><Checkout /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />


          {/* Admin */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          } />

          {/* Faculty */}
          <Route path="/faculty/*" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyLayout />
            </ProtectedRoute>
          } />

          {/* Student */}
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  )
}

export default App
