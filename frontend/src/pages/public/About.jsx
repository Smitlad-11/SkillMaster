import { Link } from 'react-router-dom'

const About = () => {
  const icons = {
    globe: <svg className="w-4 h-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    target: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    users: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    lightbulb: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    chevronRight: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-40 overflow-hidden bg-primary-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary-600/30 to-transparent rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 font-medium text-sm mb-8">
            {icons.globe}
            Global Learning Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            Empowering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-300">Next Generation</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100/80 max-w-3xl mx-auto font-light leading-relaxed">
            We are building the world's most accessible, high-quality educational ecosystem. Bridging the gap between ambition and opportunity.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-bold tracking-widest uppercase text-xs mb-8">
                Our Purpose
              </div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                At SkillMaster, we believe that quality education shouldn't be a privilege. It should be accessible to everyone, everywhere. Our mission is to provide industry-relevant skills taught by top experts, giving every student the tools they need to succeed.
              </p>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                To become the global standard for professional upskilling. We envision a world where anyone can unlock their full potential and build a rewarding career regardless of their background, location, or financial status.
              </p>
              
              <div>
                 <Link to="/courses" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors text-lg group">
                   See our impact <span className="group-hover:translate-x-1 transition-transform">{icons.chevronRight}</span>
                 </Link>
              </div>
            </div>
            
            <div className="relative group transition-all duration-700 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-[3rem] transform rotate-3 scale-105 opacity-30 blur-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-700"></div>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Students collaborating" className="relative rounded-[3rem] shadow-2xl object-cover h-[500px] md:h-[700px] w-full border border-gray-100 dark:border-gray-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">The principles that guide our platform, our team, and our community.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: icons.target, title: 'Excellence', desc: 'We hold ourselves to the highest standards. We deliver nothing but the best in content, experience, and platform support.' },
              { icon: icons.users, title: 'Community', desc: 'Real growth happens together. We foster a collaborative environment where learners and mentors grow side by side.' },
              { icon: icons.lightbulb, title: 'Innovation', desc: 'Education must evolve. We continuously leverage the latest in educational technology to create unparalleled learning journeys.'}
            ].map((val, idx) => (
               <div key={idx} className="p-12 rounded-3xl bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/30 dark:shadow-none hover:-translate-y-3 transition-transform duration-500 border border-gray-100 dark:border-gray-700 group">
                 <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                   {val.icon}
                 </div>
                 <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">{val.title}</h3>
                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{val.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Ready to Start Learning?</h2>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-12">Join millions of learners from around the world.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:-translate-y-1">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
