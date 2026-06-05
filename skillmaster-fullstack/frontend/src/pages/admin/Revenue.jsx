// pages/admin/Revenue.jsx
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Spinner from '../../components/Spinner'

const Revenue = () => {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/users/stats')])
      .then(([ordersRes, statsRes]) => {
        setOrders(ordersRes.data)
        setStats(statsRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const revenueChart = stats?.revenueData?.map(d => ({
    month: MONTHS[d._id - 1], revenue: d.revenue, orders: d.count
  })) || []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Revenue & Orders</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Total Revenue</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Total Orders</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-600">
            ₹{orders.length > 0 ? Math.round(stats?.totalRevenue / orders.length).toLocaleString('en-IN') : 0}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Avg Order Value</p>
        </div>
      </div>

      {revenueChart.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold dark:text-white mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Student', 'Course', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 dark:text-white">{order.student?.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{order.course?.title}</td>
                  <td className="px-4 py-3 font-medium text-green-600">₹{order.amount}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">Paid</span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Revenue
