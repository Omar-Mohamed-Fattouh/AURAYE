// src/admin/pages/AdminMessages.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Reply, Trash2, X, Send, Clock, CheckCircle } from 'lucide-react';
import AdminPanelApi from '../api/AdminPanelApi';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | new | replied
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await AdminPanelApi.getAllMessages();
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return alert('Please write a reply');
    
    setSending(true);
    try {
      await AdminPanelApi.replyToMessage({
        id: selectedMessage.id,
        replyMessage: replyText
      });
      setMessages(messages.map(m => 
        m.id === selectedMessage.id ? { ...m, status: 'Replied' } : m
      ));
      setShowModal(false);
      setReplyText('');
      alert('Reply sent successfully!');
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'new') return matchesSearch && m.status !== 'Replied';
    if (filter === 'replied') return matchesSearch && m.status === 'Replied';
    return matchesSearch;
  });

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const MessageCard = ({ message }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => {
        setSelectedMessage(message);
        setShowModal(true);
      }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            {message.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900">{message.name}</p>
            <p className="text-xs text-gray-500">{message.email}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          message.status === 'Replied'
            ? 'bg-green-50 text-green-700'
            : 'bg-amber-50 text-amber-700'
        }`}>
          {message.status === 'Replied' ? (
            <span className="flex items-center gap-1">
              <CheckCircle size={12} /> Replied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Clock size={12} /> New
            </span>
          )}
        </span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-2">{message.subject}</h4>
      <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{formatDate(message.createdAt)}</span>
        <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <Reply size={14} /> Reply
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Messages</h2>
        <p className="text-gray-500 mt-1">{filteredMessages.length} messages</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'replied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-4" />
              <div className="h-6 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-20">
          <Mail size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No messages found</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMessages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </motion.div>
      )}

      {/* Reply Modal */}
      <AnimatePresence>
        {showModal && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedMessage.subject}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    From: {selectedMessage.name} ({selectedMessage.email})
                  </p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Original Message */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Original Message</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                <p className="text-xs text-gray-400 mt-3">{formatDate(selectedMessage.createdAt)}</p>
              </div>

              {/* Reply Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Reply</label>
                <textarea
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={sending || !replyText.trim()}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? 'Sending...' : <><Send size={18} /> Send Reply</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;