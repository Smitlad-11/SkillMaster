import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: '📊', end: true },
  { to: '/courses', label: 'Browse Courses', icon: '🔍' },
  { to: '/student/enrollments', label: 'My Enrollments', icon: '📖' },
  { to: '/student/assignments', label: 'Assignments', icon: '📝' },
  { to: '/student/certificates', label: 'Certificates', icon: '🏆' },
  { to: '/student/profile', label: 'My Profile', icon: '👤' },
  { to: '/student/settings', label: 'Change Password', icon: '🔑' },
  { to: '/student/feedback', label: 'Help & Feedback', icon: '💬' },
]

const facultyLinks = [
  { to: '/faculty', label: 'Dashboard', icon: '📊', end: true },
  { to: '/faculty/courses', label: 'My Courses', icon: '📚' },
  { to: '/faculty/create-course', label: 'Create Course', icon: '➕' },
  { to: '/faculty/students', label: 'Students', icon: '🎓' },
  { to: '/faculty/assignments', label: 'Assignments', icon: '📝' },
  { to: '/faculty/profile', label: 'My Profile', icon: '👤' },
  { to: '/faculty/settings', label: 'Change Password', icon: '🔑' },
]

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/courses', label: 'Courses', icon: '📚' },
  { to: '/admin/revenue', label: 'Revenue', icon: '💰' },
  { to: '/admin/contacts', label: 'Contacts', icon: '📩' },
  { to: '/admin/feedback', label: 'Feedback', icon: '⭐' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

const Sidebar = () => {
  const { user } = useSelector(state => state.auth)

  if (!user) return null

  let links = []
  let bgColor = ''
  let hoverBg = ''
  let activeBg = ''
  let textColor = ''

  if (user.role === 'student') {
    links = studentLinks
    bgColor = 'bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800'
    hoverBg = 'hover:bg-primary-50 dark:hover:bg-primary-900/20'
    activeBg = 'bg-primary-600 shadow-lg shadow-primary-600/20'
    textColor = 'text-gray-600 dark:text-gray-400'
  } else if (user.role === 'faculty') {
    links = facultyLinks
    bgColor = 'bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800'
    hoverBg = 'hover:bg-primary-50 dark:hover:bg-primary-900/20'
    activeBg = 'bg-primary-600 shadow-lg shadow-primary-600/20'
    textColor = 'text-gray-600 dark:text-gray-400'
  } else if (user.role === 'admin') {
    links = adminLinks
    bgColor = 'bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800'
    hoverBg = 'hover:bg-primary-50 dark:hover:bg-primary-900/20'
    activeBg = 'bg-primary-600 shadow-lg shadow-primary-600/20'
    textColor = 'text-gray-600 dark:text-gray-400'
  }

  return (
    <aside className={`w-72 ${bgColor} flex-shrink-0 transition-all duration-300`}>
      <div className="p-6 border-b border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-primary-600/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">{user?.role}</p>
          </div>
        </div>
      </div>
      <nav className="p-4 space-y-1.5">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.end}
            className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              isActive 
                ? `${activeBg} text-white` 
                : `${textColor} ${hoverBg} hover:translate-x-1`
            }`}>
            <span className="text-lg">{link.icon}</span> {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
