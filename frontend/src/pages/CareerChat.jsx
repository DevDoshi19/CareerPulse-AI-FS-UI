import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatWithAIStream, uploadFile } from '../services/api';

export default function CareerChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm CareerForge AI. Ask me about interview prep, career roadmaps, or upload a Resume/JD using the paperclip icon for specialized document analysis." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
       alert("Only PDF and TXT files are accepted for document analysis.");
       return;
    }
    
    setUploading(true);
    
    try {
      await uploadFile(file);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `*[System]*: Successfully indexed Document: **${file.name}**. I can now answer specific questions about it!` 
      }]);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  const handleSend = async () => {
    const query = input.trim();
    if (!query || loading || uploading) return;
    
    setInput('');
    const newMessages = [...messages, { role: 'human', content: query }];
    setMessages(newMessages);
    setLoading(true);
    
    // Process backend chat history 
    const chatHistory = newMessages
      .filter(m => !m.content.startsWith('*[System]*'))
      .slice(0, -1)
      .map((m) => ({ role: m.role, content: m.content }));

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
      setMessages((prev) => [...prev, { role: 'ai', content: `Unable to connect to the AI model. ${err.message || 'Please try again.'}` }]);
    } finally {
      setLoading(false);
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(); 
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-slate-50 dark:bg-[#121212] relative">
      
      {/* ─── Top Navigation ─── */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <Link to="/" className="flex items-center gap-2 text-[14px] font-medium text-slate-500 hover:text-slate-900 dark:text-[#a0a0a0] dark:hover:text-white transition-colors bg-white/80 dark:bg-[#212121]/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-[#333]">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* ─── Main Chat Area ─── */}
      <div className="flex-1 overflow-y-auto w-full scroll-smooth pt-24 pb-40">
        <div className="max-w-4xl mx-auto px-4 md:px-8 flex flex-col gap-8">
          {messages.map((msg, i) => {
            const isHuman = msg.role === 'human';
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex w-full ${isHuman ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] md:max-w-[75%] px-5 py-4 ${
                  isHuman 
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-3xl rounded-br-sm shadow-md' 
                    : 'bg-white text-slate-800 dark:bg-[#212121] dark:text-slate-200 rounded-3xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-[#333]'
                }`}>
                  <div className={`prose max-w-none text-[15.5px] ${isHuman ? 'prose-invert dark:prose-slate' : 'dark:prose-invert prose-slate'} prose-p:leading-relaxed prose-pre:bg-black/5 dark:prose-pre:bg-white/5 prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                    
                    {!isHuman && msg.content === '' && loading && (
                      <span className="inline-flex items-center gap-1.5 h-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* ─── Input Tray (Bottom) ─── */}
      <div className="absolute bottom-0 inset-x-0 pb-6 pt-12 bg-gradient-to-t from-slate-50 via-slate-50 dark:from-[#121212] dark:via-[#121212] to-transparent shrink-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="relative w-full rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-lg shadow-slate-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-200 dark:border-[#333] flex flex-col pt-3 pb-2 px-3 transition-colors">
            
            {uploading && (
              <div className="flex items-center gap-2 mb-2 px-2 text-[12px] text-teal-600 dark:text-teal-400 font-medium animate-pulse">
                Uploading securely to knowledge base...
              </div>
            )}

            <textarea
              ref={inputRef}
              className="w-full text-[15px] px-2 max-h-[200px] bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#666] outline-none ring-0 focus:ring-0 resize-none border-none shadow-none"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = '24px';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={handleKeyDown}
              disabled={loading || uploading}
              rows={1}
              style={{ height: '24px' }}
              id="chat-input"
            />
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.txt" 
                  onChange={handleFileSelect}
                />
                <button 
                  title="Upload Resume or Context File"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || uploading}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-[#a0a0a0] dark:hover:text-white dark:hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                  <Paperclip className="w-[18px] h-[18px]" />
                </button>
              </div>

              <button
                onClick={handleSend}
                disabled={loading || uploading || !input.trim()}
                className="p-1.5 rounded-lg bg-teal-900 text-white dark:bg-white dark:text-black disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-[#333] dark:disabled:text-[#666] transition-colors shadow-sm"
              >
                <Send className="w-4 h-4 translate-x-px" />
              </button>
            </div>

          </div>
          <div className="text-center mt-3">
            <span className="text-[11px] text-slate-400 dark:text-[#666]">AI can make mistakes. Verify important context.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
