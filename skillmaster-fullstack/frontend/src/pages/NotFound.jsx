// pages/NotFound.jsx
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
    <div className="text-center">
      <div className="text-9xl font-bold text-primary-600">404</div>
      <h1 className="text-3xl font-bold dark:text-white mt-4">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-block px-8 py-3">Go Home</Link>
    </div>
  </div>
)

export default NotFound
