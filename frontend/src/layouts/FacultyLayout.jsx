// layouts/FacultyLayout.jsx
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import FacultyDashboard from '../pages/faculty/FacultyDashboard'
import FacultyCourses from '../pages/faculty/FacultyCourses'
import FacultyStudents from '../pages/faculty/FacultyStudents'
import FacultyAssignments from '../pages/faculty/FacultyAssignments'
import ManageAssignments from '../pages/faculty/ManageAssignments'
import CreateCourse from '../pages/faculty/CreateCourse'
import CreateLecture from '../pages/faculty/CreateLecture'
import CourseLectures from '../pages/faculty/CourseLectures'
import EditCourse from '../pages/faculty/EditCourse'
import EditLecture from '../pages/faculty/EditLecture'
import ViewStudents from '../pages/faculty/ViewStudents'
import ManageQueries from '../pages/faculty/ManageQueries'
import ManageSessions from '../pages/faculty/ManageSessions'
import Settings from '../pages/Settings'
import Profile from '../pages/student/Profile'

const navLinks = [
  { to: '/faculty', label: 'Dashboard', icon: '📊', end: true },
  { to: '/faculty/courses', label: 'My Courses', icon: '📚' },
  { to: '/faculty/create-course', label: 'Create Course', icon: '➕' },
  { to: '/faculty/students', label: 'Students', icon: '🎓' },
  { to: '/faculty/assignments', label: 'Assignments', icon: '📝' },
  { to: '/faculty/queries', label: 'Student Queries', icon: '💬' },
  { to: '/faculty/sessions', label: 'Live Sessions', icon: '📅' },
  { to: '/faculty/profile', label: 'My Profile', icon: '👤' },
  { to: '/faculty/settings', label: 'Change Password', icon: '🔑' },
]

const FacultyLayout = () => {
  const { user } = useSelector(state => state.auth)

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 transition-all duration-300">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-primary-600/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">Faculty</p>
            </div>
          </div>
        </div>
        <nav className="p-4 flex flex-col h-[calc(100%-88px)]">
          <div className="space-y-1.5 flex-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end}
                className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:translate-x-1'
                }`}>
                <span className="text-lg">{link.icon}</span> {link.label}
              </NavLink>
            ))}
          </div>

        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <Routes>
          <Route index element={<FacultyDashboard />} />
          <Route path="courses" element={<FacultyCourses />} />
          <Route path="students" element={<FacultyStudents />} />
          <Route path="assignments" element={<FacultyAssignments />} />
          <Route path="queries" element={<ManageQueries />} />
          <Route path="sessions" element={<ManageSessions />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="courses/:courseId/edit" element={<EditCourse />} />
          <Route path="courses/:courseId/lectures" element={<CourseLectures />} />
          <Route path="courses/:courseId/lectures/:lectureId/edit" element={<EditLecture />} />
          <Route path="courses/:courseId/assignments" element={<ManageAssignments />} />
          <Route path="courses/:courseId/add-lecture" element={<CreateLecture />} />
          <Route path="courses/:courseId/students" element={<ViewStudents />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default FacultyLayout
