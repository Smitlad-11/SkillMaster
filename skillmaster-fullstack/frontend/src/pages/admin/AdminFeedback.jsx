import { useState, useEffect } from 'react';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data } = await api.get('/platform-feedback');
      if (data.success) {
        setFeedbacks(data.data);
      } else {
        setError(data.message || 'Failed to fetch feedback');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching feedback');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Community <span className="text-primary-600">Feedback</span></h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Real-time insights and ratings from your students</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 font-bold border border-red-100">{error}</div>}

      <div className="card !p-0 overflow-hidden border-2 border-gray-50 dark:border-gray-800 shadow-premium">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Submitted On</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Details</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Experience Rating</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="text-8xl mb-6 transform hover:scale-110 transition-transform cursor-default">✨</div>
                    <p className="text-xl font-black text-gray-900 dark:text-white">Awaiting First Feedback</p>
                    <p className="text-sm text-gray-400 mt-1 font-bold">New submissions will appear here instantly.</p>
                  </td>
                </tr>
              ) : (
                feedbacks.map(fb => (
                  <tr key={fb._id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                       <span className="text-xs font-black text-gray-400 group-hover:text-primary-600 transition-colors uppercase tracking-widest">{new Date(fb.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-white shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
                          {fb.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-black text-gray-900 dark:text-white">{fb.name}</div>
                          <div className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">{fb.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 w-fit">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= fb.rating ? 'text-accent-500' : 'text-gray-200 dark:text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 max-w-sm">
                       <p className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-relaxed italic group-hover:text-gray-900 dark:group-hover:text-white transition-colors">"{fb.message}"</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
