import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

const Feedback = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback' or 'doubts'
  
  // Feedback State
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Doubts State
  const [queries, setQueries] = useState([]);
  const [loadingDoubts, setLoadingDoubts] = useState(false);

  const fetchQueries = async () => {
    setLoadingDoubts(true);
    try {
      const { data } = await api.get('/queries/my');
      setQueries(data);
    } catch { }
    setLoadingDoubts(false);
  };

  useEffect(() => {
    if (activeTab === 'doubts') fetchQueries();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a star rating');
    if (!message.trim()) return toast.error('Please enter a message');

    setIsSubmitting(true);
    try {
      await api.post('/platform-feedback', {
        name: user?.name,
        email: user?.email,
        role: user?.role,
        rating,
        message: message.trim()
      });

      toast.success('Feedback submitted successfully!');
      setMessage('');
      setRating(0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3 uppercase">Help & <span className="text-primary-600">Support</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Resolution portal and platform improvement hub</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 shadow-inner">
           <button 
             onClick={() => setActiveTab('feedback')}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
               activeTab === 'feedback' ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-md ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'
             }`}>
             Platform Feedback
           </button>
           <button 
             onClick={() => setActiveTab('doubts')}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
               activeTab === 'doubts' ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-md ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'
             }`}>
             Doubt History
           </button>
        </div>
      </div>

      {activeTab === 'feedback' ? (
        <div className="card shadow-premium border-2 border-gray-50 dark:border-gray-800 !p-10 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* User Context */}
            <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-3xl border border-primary-100 dark:border-primary-800/50 flex flex-wrap gap-10">
              <div>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Submitting As</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">{user?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Official Email</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">{user?.email}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-4">
              <label className="block text-lg font-black text-gray-900 dark:text-white">How would you rate your experience?</label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button" key={star} onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-all duration-300 hover:scale-125"
                  >
                    <svg className={`w-12 h-12 ${star <= (hoverRating || rating) ? 'text-accent-500 filter drop-shadow-lg' : 'text-gray-200 dark:text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-4">
              <label htmlFor="message" className="block text-lg font-black text-gray-900 dark:text-white">Tell us more about it</label>
              <textarea
                id="message" required rows="5" value={message} onChange={(e) => setMessage(e.target.value)}
                className="input !rounded-3xl !py-5 !px-6 min-h-[150px] resize-none text-base"
                placeholder="Detailed feedback, feature requests, or any issues encountered..."
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <button type="submit" disabled={isSubmitting} className="btn-primary !py-5 !px-12 shadow-2xl flex items-center gap-3 transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 font-black uppercase text-xs tracking-widest">
                {isSubmitting ? 'Transmitting...' : 'Submit Resolution 🚀'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
           {loadingDoubts ? <Spinner /> : queries.length === 0 ? (
             <div className="card !p-20 text-center flex flex-col items-center">
                <div className="text-6xl mb-6 grayscale opacity-20">💬</div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No doubts posted yet</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
                {queries.map(q => (
                  <div key={q._id} className="card !p-8 border-2 border-transparent hover:border-primary-100 transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">{q.course?.title}</p>
                           <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">{new Date(q.createdAt).toLocaleDateString()} Doubt</h3>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          q.isResolved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {q.isResolved ? 'Resolved' : 'Review Pending'}
                        </span>
                     </div>
                     
                     <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl mb-6 border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Question</p>
                        <p className="font-bold text-gray-800 dark:text-gray-200">"{q.question}"</p>
                     </div>

                     {q.isResolved && (
                       <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-800/10 group-hover:scale-[1.01] transition-transform">
                          <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-2">Instructor Response</p>
                          <p className="font-bold text-gray-800 dark:text-white italic">"{q.answer}"</p>
                       </div>
                     )}
                  </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default Feedback;
