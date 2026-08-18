// layouts/StudentLayout.jsx

import { NavLink, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'

import StudentDashboard from '../pages/student/StudentDashboard'
import StudentEnrollments from '../pages/student/StudentEnrollments'
import Certificates from '../pages/student/Certificates'
import StudentAssignments from '../pages/student/StudentAssignments'
import StudentSessions from '../pages/student/StudentSessions'
import Profile from '../pages/student/Profile'
import WatchLecture from '../pages/student/WatchLecture'
import Settings from '../pages/Settings'
import PaymentHistory from '../pages/student/PaymentHistory'
import Feedback from '../pages/student/Feedback'
import SupportInquiries from '../pages/student/SupportInquiries'

const navLinks = [
  { to: '/student', label: 'Dashboard', icon: '📊', end: true },
  { to: '/courses', label: 'Browse Courses', icon: '🔍' },
  { to: '/student/enrollments', label: 'My Enrollments', icon: '📖' },
  { to: '/student/sessions', label: 'Live Events', icon: '📅' },
  { to: '/student/assignments', label: 'Assignments', icon: '📝' },
  { to: '/student/certificates', label: 'Certificates', icon: '🏆' },
  { to: '/student/payments', label: 'Payment History', icon: '💳' },
  { to: '/student/profile', label: 'My Profile', icon: '👤' },
  { to: '/student/settings', label: 'Change Password', icon: '🔑' },
  { to: '/student/feedback', label: 'Help & Feedback', icon: '💬' },
  { to: '/student/support-inquiries', label: 'Support Inquiries', icon: '📩' },
]

const StudentLayout = () => {
  const { user } = useSelector(state => state.auth)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] min-w-0 bg-gray-50 dark:bg-gray-900 overflow-x-hidden">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
        <div className="w-full">

          <div className="p-6 border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-primary-600/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div className="overflow-hidden">
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>

                <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">
                  Student Learner
                </p>
              </div>
            </div>
          </div>

          <nav className="p-4 flex flex-col min-h-[calc(100vh-152px)]">
            <div className="space-y-1.5 flex-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:translate-x-1'
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
          onClick={closeMobileSidebar}
        >
          <aside
            className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >

            <div className="p-5 border-b border-gray-100 dark:border-gray-800">

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                  Student Menu
                </p>

                <button
                  onClick={closeMobileSidebar}
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-white"
                  aria-label="Close student menu"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-lg text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="overflow-hidden">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>

                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">
                    Student Learner
                  </p>
                </div>

              </div>
            </div>

            <nav className="p-4 space-y-1.5">

              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}

            </nav>
          </aside>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative flex-1 min-w-0 bg-gray-50 dark:bg-gray-900 overflow-x-hidden">

        {/* Mobile menu button */}
        <div className="lg:hidden sticky top-0 z-40 px-4 py-3 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">

          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-black text-gray-800 dark:text-white shadow-sm"
          >
            ☰
            <span>Student Menu</span>
          </button>

        </div>

        <Routes>
          <Route index element={<StudentDashboard />} />
          <Route path="enrollments" element={<StudentEnrollments />} />
          <Route path="sessions" element={<StudentSessions />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="watch/:courseId" element={<WatchLecture />} />
          <Route path="settings" element={<Settings />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="support-inquiries" element={<SupportInquiries />} />
        </Routes>

      </main>
    </div>
  )
}

export default StudentLayout