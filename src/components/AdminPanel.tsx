import { useState, useEffect } from 'react';
import { Mail, User, Calendar, MessageSquare, ChevronLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white rounded-full transition-colors shadow-sm bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Message Dashboard</h1>
          </div>
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-sm font-medium border border-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium text-sm">{error}</p>
            {error === 'Database not connected' && (
              <span className="ml-auto text-xs italic opacity-75">
                Ensure MONGODB_URI is white-listed (0.0.0.0/0)
              </span>
            )}
          </div>
        )}

        {loading && messages.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-500">No messages found yet.</p>
            <p className="text-gray-400 mt-2">Messages from your contact form will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={msg._id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{msg.subject}</h3>
                <p className="text-sm font-medium text-gray-600 mb-4">{msg.name}</p>

                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg mb-4">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${msg.email}`} className="text-xs text-blue-600 hover:underline truncate">
                    {msg.email}
                  </a>
                </div>

                <div className="flex-grow">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
                    "{msg.message}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
