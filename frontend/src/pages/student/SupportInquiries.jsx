// pages/student/SupportInquiries.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

const SupportInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/contacts/my');
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2">Support <span className="text-primary-600">History</span></h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Track your direct inquiries and administrative responses</p>
      </div>

      <div className="space-y-6">
        {inquiries.length === 0 ? (
          <div className="card text-center py-24 border-2 border-dashed border-gray-100 dark:border-gray-800 bg-transparent">
             <div className="text-6xl mb-6 opacity-20">📩</div>
             <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase">No Inquiries Found</h2>
             <p className="text-sm text-gray-500 mt-2 font-bold max-w-xs mx-auto uppercase tracking-tighter">Your direct messages to SkillMaster support will appear here once submitted.</p>
          </div>
        ) : (
          inquiries.map((iq) => (
            <div key={iq._id} className="card !p-0 overflow-hidden border-2 border-gray-50 dark:border-gray-800 hover:border-primary-100 dark:hover:border-primary-900/30 transition-all group">
               <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                     <span className="text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-1.5 rounded-full uppercase tracking-widest leading-none">
                        Inquiry Reference: #{iq._id.slice(-6).toUpperCase()}
                     </span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(iq.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Message</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">"{iq.message}"</p>
                     </div>

                     {iq.response ? (
                        <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-[2rem] border border-primary-100 dark:border-primary-800/50 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🏛️</div>
                           <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mb-3">SkillMaster Official Response</p>
                           <p className="text-sm text-gray-900 dark:text-white font-bold leading-relaxed">{iq.response}</p>
                           <p className="text-[8px] font-black text-primary-400 uppercase mt-4">Responded on {new Date(iq.respondedAt).toLocaleDateString()}</p>
                        </div>
                     ) : (
                        <div className="flex items-center gap-3 px-6 py-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800/50">
                           <span className="animate-pulse">🕒</span>
                           <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Under Review by Administrator</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportInquiries;
