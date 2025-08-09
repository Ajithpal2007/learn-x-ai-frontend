// /src/pages/AiChatbot.jsx

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- UI Components (ChatBubble, TypingIndicator, QuickPromptButton) ---
// These components are correct and do not need changes.
const ChatBubble = ({ message, sender }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    {sender === 'ai' && <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-primary flex-shrink-0">A</div>}
    <div className={`max-w-xl p-4 rounded-2xl shadow-sm ${sender === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-white text-dark rounded-bl-lg'}`}><p className="whitespace-pre-wrap">{message}</p></div>
  </motion.div>
);
const TypingIndicator = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mb-4 justify-start">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-primary flex-shrink-0">A</div>
        <div className="max-w-xl p-4 rounded-2xl bg-white shadow-sm rounded-bl-lg flex items-center gap-2">
            <motion.span animate={{y: [0, -4, 0]}} transition={{duration: 1, repeat: Infinity}} className="w-2 h-2 bg-gray-400 rounded-full" />
            <motion.span animate={{y: [0, -4, 0]}} transition={{duration: 1, repeat: Infinity, delay: 0.2}} className="w-2 h-2 bg-gray-400 rounded-full" />
            <motion.span animate={{y: [0, -4, 0]}} transition={{duration: 1, repeat: Infinity, delay: 0.4}} className="w-2 h-2 bg-gray-400 rounded-full" />
        </div>
    </motion.div>
);
const QuickPromptButton = ({ text, onSend }) => (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onSend(text)} className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-primary text-left hover:bg-primary/10 transition-colors">
        {text}
    </motion.button>
);


function AiChatbot() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { userInfo } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleSend = async (prompt) => {
    const userMessageText = prompt || input;
    if (userMessageText.trim() === '' || isTyping) return;

    // --- FIX: Check for userInfo before sending ---
    if (!userInfo || !userInfo.token) {
        setMessages(prev => [...prev, { sender: 'ai', text: "Authentication error. Please log in again." }]);
        return;
    }

    const newMessages = [...messages, { sender: 'user', text: userMessageText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
        // --- FIX: Correctly add the Authorization header ---
        const config = { 
            headers: { Authorization: `Bearer ${userInfo.token}` } 
        };
        const body = { message: userMessageText };
        
        // --- FIX: Use the full URL for the API call ---
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, body, config);
        
        // API returns the full history, so we replace our state with it.
        setMessages(data);
    } catch (error) {
        const errorMessage = { sender: 'ai', text: "Sorry, I'm having trouble connecting. Please try again later." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsTyping(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  const showIntro = messages.length === 0;

  return (
    <div className="flex h-screen bg-light-gray">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <Header title="AI Chatbot" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 flex flex-col p-6 md:p-8 overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-4 pr-4 max-w-3xl w-full mx-auto">
            {showIntro && (
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="text-center my-12">
                     <div className="w-16 h-16 mb-4 mx-auto rounded-full bg-gray-200 flex items-center justify-center font-bold text-primary text-2xl">A</div>
                     <h1 className="text-2xl font-bold text-dark">Hello! How can I help you?</h1>
                     <p className="text-gray-600 mt-2">Start a conversation or try one of these prompts.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-lg mx-auto">
                        <QuickPromptButton onSend={handleSend} text="What are some good careers for someone who likes art and technology?" />
                        <QuickPromptButton onSend={handleSend} text="Explain the difference between JEE Main and JEE Advanced." />
                     </div>
                </motion.div>
            )}

            {messages.map((msg, index) => ( <ChatBubble key={index} message={msg.text} sender={msg.sender} /> ))}
            {isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-auto max-w-3xl w-full mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-end gap-2 shadow-sm">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about careers, colleges, or exams..."
                className="flex-1 bg-transparent text-dark placeholder:text-gray-500 focus:outline-none resize-none max-h-40 p-2"
                rows="1"
                disabled={isTyping}
              />
              <button onClick={() => handleSend()} disabled={isTyping || !input.trim()} className="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors self-end">
                Send
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default AiChatbot;