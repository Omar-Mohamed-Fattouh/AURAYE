// src/admin/pages/AdminNewsletter.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Type, Megaphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import AdminPanelApi from '../api/AdminPanelApi';

const AdminNewsletter = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success | error

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!subject || !message) return alert('Subject and Message are required!');

    setLoading(true);
    setStatus(null);

    try {
      await AdminPanelApi.sendCampaign({
        subject,
        htmlMessage: message,
        imageUrls
      });
      setStatus('success');
      setTimeout(() => {
        setStatus(null);
        setSubject('');
        setMessage('');
        setImageUrls('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const previewImages = imageUrls
    .split(',')
    .map(url => url.trim())
    .filter(url => url);

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Megaphone size={28} />
          Campaign Manager
        </h2>
        <p className="text-gray-500 mt-1">Create and send newsletters to all subscribers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Compose Email</h3>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
              HTML Supported
            </span>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-5">
            {/* Subject */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Type size={16} /> Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Summer Sale is Here! ☀️"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message Body</label>
              <textarea
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message... HTML tags supported"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>

            {/* Images */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <ImageIcon size={16} /> Image URLs <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://img1.com, https://img2.com (Comma separated)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2 border border-green-200"
                >
                  <CheckCircle size={20} />
                  Campaign sent successfully!
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2 border border-red-200"
                >
                  <AlertCircle size={20} />
                  Failed to send campaign
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || !subject || !message}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={20} /> Send Campaign
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
            <span className="text-xs text-gray-400">Email Template</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Fake Browser Header */}
            <div className="bg-gray-100 border-b border-gray-200 p-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white h-6 rounded px-3 text-[10px] text-gray-400 flex items-center">
                {subject || 'Your Subject Here...'}
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6 bg-gray-50 max-h-[600px] overflow-y-auto">
              <div className="max-w-md mx-auto bg-white rounded-2xl overflow-hidden shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-center">
                  <h1 className="text-white text-2xl font-black tracking-tight">
                    {subject || 'SUBJECT HEADER'}
                  </h1>
                  <p className="text-emerald-50 text-sm mt-3 font-medium">
                    Latest updates from Auraye
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {message ? (
                    <div
                      className="text-gray-700 text-sm leading-7 mb-6"
                      dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br>') }}
                    />
                  ) : (
                    <p className="text-gray-300 italic text-center py-8">
                      Start typing your message...
                    </p>
                  )}

                  {/* Images Preview */}
                  {previewImages.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {previewImages.map((url, i) => (
                        <div key={i} className="rounded-xl overflow-hidden bg-white shadow-sm">
                          <img
                            src={url}
                            alt={`Preview ${i + 1}`}
                            className="w-full object-cover"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="text-center">
                    <span className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg">
                      Explore Collection
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    © 2025 Auraye. All rights reserved.<br />
                    Follow us on social media
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNewsletter;