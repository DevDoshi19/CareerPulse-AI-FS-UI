import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { chatWithAIStream } from '../services/api';

const ease = [0.22, 1, 0.36, 1];

export default function CareerChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AI Career Coach. Ask me about interview prep, career roadmaps, or salary negotiation." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'human', content: query }];
    setMessages(newMessages);
    setLoading(true);
    const chatHistory = newMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content }));

    try {
      const stream = await chatWithAIStream({ query, chatHistory });
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      setMessages((prev) => [...prev, { role: 'ai', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'ai', content: fullResponse };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', content: `Unable to process. ${err.message || 'Please try again.'}` }]);
    } finally {
      setLoading(false);
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-950 transition-colors">
      
      {/* Header Border Layer */}
      <div className="absolute top-0 inset-x-0 h-4 bg-white dark:bg-slate-950 z-10 pointer-events-none" />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto w-full pb-40" id="chat-messages">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
            <svg className="w-12 h-12 mb-4 text-slate-200 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[15px] font-medium">How can I help you today?</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: i === messages.length - 1 ? 0.05 : 0 }}
              className={`w-full py-8 ${
                msg.role === 'ai' 
                  ? 'bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800' 
                  : 'bg-white dark:bg-slate-950'
              } transition-colors`}
            >
              <div className="max-w-[800px] mx-auto px-6 md:px-8 flex gap-5">
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                  msg.role === 'human' 
                    ? 'bg-teal-900 text-white' 
                    : 'bg-teal-500 text-slate-950'
                }`}>
                  <span className="text-sm font-bold">{msg.role === 'human' ? 'You' : 'AI'}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-1 text-[15px] leading-[1.7] text-slate-700 dark:text-slate-300">
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                  {msg.role === 'ai' && msg.content === '' && loading && (
                    <span className="inline-flex gap-1.5 ml-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area (Pinned to bottom) */}
      <div className="absolute bottom-0 inset-x-0 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 pt-6 pb-6 px-4 transition-colors">
        <div className="max-w-[760px] mx-auto">
          <div className="relative w-full">
            <textarea
              ref={inputRef}
              className="w-full text-[15px] pl-5 pr-14 py-4 max-h-[200px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 shadow-sm resize-none transition-all duration-200"
              placeholder="Ask anything about your career..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = '60px';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              id="chat-input"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-3 bottom-3 w-8 h-8 bg-teal-900 dark:bg-teal-500 hover:bg-teal-800 dark:hover:bg-teal-400 text-white dark:text-slate-950 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              id="btn-send"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 translate-x-[1px] -translate-y-[1px]">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">CareerForge AI can make mistakes. Consider verifying important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
