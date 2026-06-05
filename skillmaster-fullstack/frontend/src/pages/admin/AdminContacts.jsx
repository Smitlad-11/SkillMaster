import { useState, useEffect } from 'react';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/contacts');
      if (data.success) {
        setContacts(data.data);
      } else {
        setError(data.message || 'Failed to fetch contacts');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e) => {
    if (e) e.preventDefault();
    
    setSubmitting(true);
    try {
      const { data } = await api.put(`/contacts/${selectedContact._id}/respond`, { response: replyText });
      if (data.success) {
        toast.success(replyText ? 'Response saved successfully' : 'Response erased successfully');
        setSelectedContact(null);
        setReplyText('');
        fetchContacts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) return;
    
    try {
      const { data } = await api.delete(`/contacts/${id}`);
      if (data.success) {
        toast.success('Inquiry deleted');
        fetchContacts();
      }
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Direct <span className="text-primary-600">Inquiries</span></h2>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Manage communication with prospective students and faculty</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-primary-50 dark:bg-primary-900/20 px-6 py-3 rounded-2xl border border-primary-100 dark:border-primary-800">
              <span className="text-xs font-black text-primary-600 uppercase tracking-widest">{contacts.filter(c => !c.response).length} Pending</span>
           </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 font-bold border border-red-100">{error}</div>}

      <div className="card !p-0 overflow-hidden border-2 border-gray-50 dark:border-gray-800 shadow-premium">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800 text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact & Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Message</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="text-8xl mb-6 transform hover:scale-110 transition-transform cursor-default">✉️</div>
                    <p className="text-xl font-black text-gray-900 dark:text-white">Inbox Clean</p>
                    <p className="text-sm text-gray-400 mt-1 font-bold">New inquiries will be listed here for your review.</p>
                  </td>
                </tr>
              ) : (
                contacts.map(contact => (
                  <tr key={contact._id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center font-black text-white shadow-lg overflow-hidden shrink-0">
                          {contact.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{contact.name}</div>
                          <div className="flex items-center gap-2">
                             <span className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${
                               contact.role === 'faculty' ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'
                             }`}>{contact.role}</span>
                             <span className="text-[9px] font-bold text-gray-400">{contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 max-w-xs">
                       <p className="text-xs font-bold text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">"{contact.message}"</p>
                       <p className="text-[9px] font-black text-gray-400 uppercase mt-2">{new Date(contact.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6">
                       {contact.response ? (
                         <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Responded</span>
                            <p className="text-[10px] text-gray-400 font-bold truncate max-w-[150px]">{contact.response}</p>
                         </div>
                       ) : (
                         <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Pending Reply</span>
                       )}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => {
                               setSelectedContact(contact);
                               setReplyText(contact.response || '');
                            }}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                               contact.response 
                               ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200' 
                               : 'bg-primary-600 text-white hover:scale-105 shadow-primary-600/20'
                            }`}
                          >
                            {contact.response ? 'Edit Response' : 'Reply Now'}
                          </button>
                          <button 
                            onClick={() => handleDelete(contact._id)}
                            className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                            title="Delete Inquiry"
                          >
                             🗑️
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                       <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Send <span className="text-primary-600">Response</span></h2>
                       <p className="text-gray-500 font-bold uppercase tracking-widest text-[9px] mt-1">Replying to {selectedContact.name}</p>
                    </div>
                    <button onClick={() => setSelectedContact(null)} className="text-2xl hover:rotate-90 transition-transform">✕</button>
                 </div>

                 <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl mb-8 border border-gray-100 dark:border-gray-800">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Original Message</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed">"{selectedContact.message}"</p>
                 </div>

                 <form onSubmit={handleRespond} className="space-y-6">
                    <div>
                       <div className="flex justify-between items-center mb-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Your Official Response</label>
                          {replyText && (
                             <button 
                               type="button"
                               onClick={() => setReplyText('')}
                               className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                             >
                               Erase Text
                             </button>
                          )}
                       </div>
                       <textarea 
                         rows="5"
                         className="input min-h-[150px] !p-6"
                         placeholder="Type your reply here..."
                         value={replyText}
                         onChange={(e) => setReplyText(e.target.value)}
                       />
                    </div>
                    <div className="flex gap-4">
                       <button 
                         type="submit" 
                         disabled={submitting}
                         className="btn-primary flex-1 !py-4 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                         {submitting ? 'Saving...' : (selectedContact.response ? 'Update Response' : 'Send Response')}
                       </button>
                       {selectedContact.response && (
                          <button 
                            type="button"
                            onClick={() => {
                               setReplyText('');
                               setTimeout(() => handleRespond(), 0);
                            }}
                            className="px-6 py-4 rounded-2xl bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                          >
                             Clear From Database
                          </button>
                       )}
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
