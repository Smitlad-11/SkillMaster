// components/CourseCard.jsx
import { Link } from 'react-router-dom'
import getImageUrl from '../utils/getImageUrl';

const CourseCard = ({ course }) => {
  const API_URL = 'http://localhost:5000'

  return (
    <div className="card group !p-0 overflow-hidden hover:-translate-y-2 transition-all duration-500">
      <div className="relative overflow-hidden h-52">
        <img
          src={course.thumbnail ? getImageUrl(course.thumbnail) : 'https://placehold.co/400x200/82308E/white?text=SkillMaster+Premium'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <span className={`absolute top-4 right-4 text-xs px-3 py-1.5 rounded-xl font-black text-white shadow-lg ${
          course.price === 0 ? 'bg-green-500' : 'bg-accent-600'
        }`}>
          {course.price === 0 ? 'FREE' : `₹${course.price}`}
        </span>
        <span className="absolute top-4 left-4 text-[10px] px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-primary-900 font-black uppercase tracking-widest shadow-sm">
          {course.level}
        </span>
      </div>
      <div className="p-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-xl">{course.category}</span>
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mt-4 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className="text-accent-500 text-lg">★</span>
            <span className="text-sm font-bold text-gray-700 dark:text-white">{course.averageRating || '4.8'}</span>
            <span className="text-xs text-gray-400 font-medium">({course.enrolledStudents?.length || 0})</span>
          </div>
          <span className="text-xs font-bold text-gray-400">
            By <span className="text-gray-700 dark:text-gray-300">{course.faculty?.name || 'Top Instructor'}</span>
          </span>
        </div>
        <Link
          to={`/courses/${course._id}`}
          className="mt-6 block w-full text-center btn-primary !rounded-2xl !py-3.5 shadow-primary-500/20"
        >
          Start Learning
        </Link>
      </div>
    </div>
  )
}

export default CourseCard
