// pages/student/PaymentHistory.jsx
import { useEffect, useState } from 'react'
import api from '../../services/api'
import Spinner from '../../components/Spinner'

const PaymentHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my')
        setOrders(data)
      } catch { }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div>
         <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 uppercase">Payment <span className="text-primary-600">History</span></h1>
         <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Secure record of all your platform transactions</p>
      </div>

      <div className="card overflow-hidden !p-0 border-2 border-gray-100 dark:border-gray-800 shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Course</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No transactions found</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-[10px] text-gray-400">#{order.razorpayOrderId}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{order.course?.title || 'Unknown Course'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-primary-600">₹{order.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center gap-4 p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/20">
         <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-xl">🛡️</div>
         <p className="text-xs font-bold text-primary-700 dark:text-primary-300">All payments are encrypted and secured via Razorpay. For billing issues, please contact support.</p>
      </div>
    </div>
  )
}

export default PaymentHistory
