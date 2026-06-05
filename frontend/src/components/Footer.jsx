// components/Footer.jsx
const Footer = () => (
  <footer className="bg-gray-900 text-white pt-24 pb-12 overflow-hidden relative">
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>
    <div className="max-w-7xl mx-auto px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
        <div className="lg:col-span-1 space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl">S</div>
              <div>
                 <p className="text-2xl font-black tracking-tight leading-none">Skill<span className="text-primary-600">Master</span></p>
                 <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none mt-1">Elite Learning</p>
              </div>
           </div>
           <p className="text-sm font-bold text-gray-500 leading-relaxed uppercase tracking-widest opacity-60">Architecting the future through world-class professional training and mentorship.</p>
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary-600 transition-all cursor-pointer">🐦</div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary-600 transition-all cursor-pointer">🔗</div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary-600 transition-all cursor-pointer">🎥</div>
           </div>
        </div>

        <div className="grid grid-cols-2 lg:col-span-3 gap-12 lg:gap-24">
           <div className="space-y-8">
              <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">Knowledge Base</h4>
              <ul className="space-y-4">
                 <li><a href="/courses" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Master Lectures</a></li>
                 <li><a href="/about" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Faculty Network</a></li>
                 <li><a href="/contact" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Global Support</a></li>
              </ul>
           </div>
           <div className="space-y-8">
              <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">Corporate</h4>
              <ul className="space-y-4">
                 <li><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Brainybeam Info-Tech Pvt Ltd</p></li>
                 <li><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Enterprise Solutions</p></li>
                 <li><p className="text-xs font-black text-white uppercase tracking-widest">support@skillmaster.com</p></li>
              </ul>
           </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">© {new Date().getFullYear()} SkillMaster Intelligence. All Rights Reserved.</p>
        <div className="flex gap-10">
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] hover:text-primary-600 transition-colors cursor-pointer">Terms</p>
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] hover:text-primary-600 transition-colors cursor-pointer">Privacy</p>
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] hover:text-primary-600 transition-colors cursor-pointer">Cookies</p>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
