// pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Spinner from '../../components/Spinner'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/stats').then(r => { setStats(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const downloadReport = () => {
    if (!stats) return;
    const data = [
      ['Platform Report', new Date().toLocaleDateString()],
      ['Metric', 'Value'],
      ['Total Users', stats.totalUsers],
      ['Total Students', stats.totalStudents],
      ['Total Faculty', stats.totalFaculty],
      ['Total Revenue', `₹${stats.totalRevenue}`],
      ['Total Courses', stats.totalCourses],
      ['Published Courses', stats.publishedCourses]
    ];
    const csvContent = data.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `SkillMaster_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <Spinner />

  const revenueChart = stats?.revenueData?.map(d => ({
    month: MONTHS[d._id - 1], revenue: d.revenue, orders: d.count
  })) || []

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 uppercase">Platform <span className="text-primary-600">Intelligence</span></h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Strategic overview and performance analytics</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => window.location.reload()} className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">🔄</button>
           <button onClick={downloadReport} className="btn-primary !px-6">Download Report</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: 'Total Users', value: stats?.totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600' },
          { label: 'Active Students', value: stats?.totalStudents, icon: '🎓', color: 'from-primary-500 to-primary-600' },
          { label: 'Master Faculty', value: stats?.totalFaculty, icon: '👨‍🏫', color: 'from-accent-500 to-accent-600' },
          { label: 'Gross Revenue', value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: '💰', color: 'from-green-500 to-green-600' },
          { label: 'Catalog Size', value: stats?.totalCourses, icon: '📚', color: 'from-orange-500 to-orange-600' },
          { label: 'Live Programs', value: stats?.publishedCourses, icon: '✅', color: 'from-teal-500 to-teal-600' },
        ].map(s => (
          <div key={s.label} className="card !p-6 group relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br ${s.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full`}></div>
            <div className="flex items-center justify-between mb-4">
               <div className="text-2xl">{s.icon}</div>
               <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${s.color} shadow-lg shadow-gray-500/20`}></div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{s.value}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      {revenueChart.length > 0 && (
        <div className="card !p-8 border-2 border-transparent hover:border-primary-100/50 transition-all">
          <div className="flex justify-between items-center mb-10">
             <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Revenue <span className="text-primary-600">Trajectory</span></h2>
             <select className="bg-gray-50 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 outline-none">
                <option>Last 12 Months</option>
                <option>Current Quarter</option>
             </select>
          </div>
          <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={revenueChart}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                 <XAxis 
                   dataKey="month" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                   dy={15}
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                   tickFormatter={(v) => `₹${v/1000}k`}
                 />
                 <Tooltip 
                   cursor={{ fill: 'rgba(130, 48, 142, 0.05)' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                   itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                   labelStyle={{ fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', color: '#82308E', marginBottom: '4px' }}
                   formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} 
                 />
                 <Bar dataKey="revenue" fill="#82308E" radius={[12, 12, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Manage Users', icon: '👥', link: '/admin/users', desc: 'Control permissions & profiles', color: 'bg-primary-600' },
          { label: 'Manage Catalog', icon: '📚', link: '/admin/courses', desc: 'Course lifecycle management', color: 'bg-accent-600' },
          { label: 'Financials', icon: '💰', link: '/admin/revenue', desc: 'Audit payments & earnings', color: 'bg-orange-600' },
          { label: 'Community Feed', icon: '⭐', link: '/admin/feedback', desc: 'Monitor user satisfaction', color: 'bg-teal-600' },
        ].map(a => (
          <Link key={a.label} to={a.link} className="card !p-8 group hover:bg-gray-900 transition-all duration-500 border-2 border-transparent">
            <div className={`w-14 h-14 rounded-2xl ${a.color} flex items-center justify-center text-2xl shadow-lg mb-6 transform group-hover:rotate-12 transition-transform`}>
               {a.icon}
            </div>
            <h3 className="font-black text-gray-900 dark:text-white group-hover:text-white transition-colors uppercase tracking-tight">{a.label}</h3>
            <p className="text-xs font-bold text-gray-400 mt-1 mb-6 group-hover:text-gray-500 transition-colors">{a.desc}</p>
            <div className="flex items-center text-[10px] font-black text-primary-600 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
               Launch Tool <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
