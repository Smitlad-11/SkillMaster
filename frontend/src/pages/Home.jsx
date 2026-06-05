import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import CourseCard from '../components/CourseCard'
import Spinner from '../components/Spinner'

const Home = () => {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector(state => state.courses)

  useEffect(() => {
    dispatch(fetchCourses({ limit: 6 }))
  }, [dispatch])

  const icons = {
    play: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    chart: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    award: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    msg: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>,
    phone: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    shield: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    arrow: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
    star: <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
  }

  const features = [
    { icon: icons.play, title: 'HD Video Lectures', desc: 'Immersive, high-quality video content taught by industry veterans.' },
    { icon: icons.chart, title: 'Smart Analytics', desc: 'Visualize your progress with intelligent dashboards and insights.' },
    { icon: icons.award, title: 'Verified Certification', desc: 'Earn recognized certificates that hold weight in the professional world.' },
    { icon: icons.msg, title: 'Interactive Assignments', desc: 'Apply what you learn through hands-on projects with feedback.' },
    { icon: icons.phone, title: 'Learn Anywhere', desc: 'A seamless, responsive experience across all your devices.' },
    { icon: icons.shield, title: 'Bank-Grade Security', desc: 'Enterprise-level encryption ensures your data is always protected.' },
  ]

  return (
    <div className="overflow-hidden bg-white dark:bg-brand-dark animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-500/10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-semibold text-sm mb-8 border border-primary-100 dark:border-primary-800 transition-all hover:scale-105">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Elevate Your Learning Experience
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.15]">
              Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">Potential</span><br className="hidden md:block" /> with SkillMaster
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              Master in-demand skills with expert-led courses. Transform your career with our interactive learning platform designed for ambitious professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/courses" className="btn-primary group !px-10 !py-5 !rounded-3xl text-xl shadow-2xl flex items-center justify-center gap-2">
                Explore Courses <span className="group-hover:translate-x-1 transition-transform">{icons.arrow}</span>
              </Link>
              <Link to="/register" className="btn-secondary group !px-10 !py-5 !rounded-3xl text-xl shadow-xl flex items-center justify-center gap-2 border-2 border-primary-100">
                Join for Free
              </Link>
            </div>

            <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800/50 flex flex-wrap justify-center gap-12 md:gap-24">
              {[
                { num: '500+', label: 'Active Students' },
                { num: '50+', label: 'Premium Courses' },
                { num: '20+', label: 'Expert Mentors' },
                { num: '95%', label: 'Success Rate' }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.num}</span>
                  <span className="text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900/50 relative border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-4">Why SkillMaster</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">A Learning Experience Like No Other</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-10 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-500/50 dark:hover:border-primary-500/50 shadow-xl shadow-gray-200/20 dark:shadow-none transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Trusted by Professionals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 relative hover:-translate-y-2 transition-transform duration-300">
                <div className="flex gap-1 mb-6 text-yellow-400">
                  {icons.star}{icons.star}{icons.star}{icons.star}{icons.star}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">"SkillMaster completely transformed my career path. The mentors are incredibly knowledgeable and the platform is a joy to use. Highly recommended!"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">SM</div>
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white">Sarah M.</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Senior Developer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Trending Courses</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Discover programs curated for ambitious learners.</p>
            </div>
            <Link to="/courses" className="group inline-flex items-center gap-2 text-accent-600 font-black hover:text-accent-700 transition-colors text-lg">
              Explore Catalog <span className="group-hover:translate-x-1 transition-transform">{icons.arrow}</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 6).map(course => (
                <div key={course._id} className="h-full hover:-translate-y-2 transition-transform duration-300">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-95"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">Ready to Transform Your Future?</h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto font-medium opacity-90">
            Join 50,000+ professionals who are already advancing their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="px-12 py-6 bg-accent-600 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-accent-700 transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95">
              Start Learning Now
            </Link>
            <Link to="/about" className="px-12 py-6 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/20 rounded-3xl font-black text-xl transition-all transform hover:-translate-y-1">
              About SkillMaster
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
