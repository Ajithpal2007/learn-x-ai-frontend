// /src/pages/AiTools.jsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- UI Component: Tab Button ---
const TabButton = ({ text, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(text)}
        className={`w-full relative px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm ${activeTab === text ? 'text-white' : 'text-primary hover:bg-primary/10'}`}
    >
        {activeTab === text && (
            <motion.div layoutId="active-tool-indicator" className="absolute inset-0 bg-primary rounded-lg z-0" />
        )}
        <span className="relative z-10">{text}</span>
    </button>
);

// --- UI Component: Chat Bubble (Light Theme) ---
const ChatBubble = ({ message, sender, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex gap-3 mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {sender === 'ai' && <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-primary flex-shrink-0">A</div>}
      <div className={`max-w-xl p-4 rounded-2xl shadow-sm ${sender === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-white text-dark rounded-bl-lg'}`}>
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
    </motion.div>
);

// --- UI Component: Problem Step Card (Light Theme) ---
const ProblemStepCard = ({ step, title, content, delay }) => (
    <motion.div 
        initial={{ opacity: 0, x: -30 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay }}
        className="flex items-start gap-4"
    >
        <div className="w-10 h-10 flex-shrink-0 bg-primary/10 text-primary font-bold flex items-center justify-center rounded-full mt-1">
            {step}
        </div>
        <div>
            <h3 className="font-bold text-dark text-lg">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{content}</p>
        </div>
    </motion.div>
);


function AiTools() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    const [activeTab, setActiveTab] = useState('AI Chatbot');

    // --- Chatbot State ---
    const [chatMessages, setChatMessages] = useState([{ sender: 'ai', text: "Hello! How can I help you today?" }]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    
    // --- Solver State ---
    const [problemInput, setProblemInput] = useState('A train travels 120 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less. Find the original speed.');
    const [solutionSteps, setSolutionSteps] = useState([]);
    const [isSolverLoading, setIsSolverLoading] = useState(false);
    const [solverError, setSolverError] = useState('');

    const handleChatSend = async () => {
        if (chatInput.trim() === '' || isChatLoading) return;
        
        const newMessages = [...chatMessages, { sender: 'user', text: chatInput }];
        setChatMessages(newMessages);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post(
                'http://localhost:5000/api/ai/chat', 
                { message: chatInput },
                config
            );
            // Assuming the API returns the full history, we just replace it
            setChatMessages(data);
        } catch (error) {
            setChatMessages([...newMessages, { sender: 'ai', text: "Sorry, I couldn't get a response. Please try again." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleSolveProblem = async () => {
        if (problemInput.trim() === '' || isSolverLoading) return;

        setIsSolverLoading(true);
        setSolverError('');
        setSolutionSteps([]);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/ai/solve-step-by-step`,
                { problem: problemInput },
                config
            );
            setSolutionSteps(data);
        } catch (error) {
            setSolverError('The AI could not solve this problem. Please try rephrasing or check the server.');
        } finally {
            setIsSolverLoading(false);
        }
    };

    const toolVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
    };

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="AI Assistant" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 flex flex-col p-6 md:p-8 overflow-hidden">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto w-full mb-8">
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-1.5 flex items-center gap-1 shadow-md">
                            <TabButton text="AI Chatbot" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton text="Step-by-Step Solver" activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'AI Chatbot' && (
                            <motion.div key="chatbot" variants={toolVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 flex flex-col overflow-hidden max-w-3xl mx-auto w-full">
                                <div className="flex-1 overflow-y-auto mb-4 pr-4">
                                    {chatMessages.map((msg, i) => <ChatBubble key={i} message={msg.text} sender={msg.sender} index={i} />)}
                                    {isChatLoading && <ChatBubble sender="ai" message="..." />}
                                </div>
                                <div className="mt-auto bg-white border border-gray-200 rounded-xl p-2 flex items-center gap-2 shadow-sm">
                                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Ask me anything..." className="w-full bg-transparent text-dark placeholder:text-gray-500 focus:outline-none p-2" disabled={isChatLoading} />
                                    <button onClick={handleChatSend} className="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400" disabled={isChatLoading}>
                                        {isChatLoading ? '...' : 'Send'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Step-by-Step Solver' && (
                            <motion.div key="solver" variants={toolVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full">
                                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-md">
                                    <h2 className="text-2xl font-bold text-dark mb-4">Problem Solver</h2>
                                    <div className="flex flex-col md:flex-row gap-2 mb-6">
                                        <textarea
                                            value={problemInput}
                                            onChange={(e) => setProblemInput(e.target.value)}
                                            placeholder="Enter a math or science problem here..."
                                            className="w-full flex-1 border-2 border-gray-200 rounded-lg p-3 text-dark placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                            rows="3"
                                        />
                                        <button onClick={handleSolveProblem} disabled={isSolverLoading} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                                            {isSolverLoading ? 'Solving...' : 'Solve'}
                                        </button>
                                    </div>
                                    
                                    {solverError && <p className="text-center text-red-500 mb-4">{solverError}</p>}
                                    
                                    <div className="space-y-6">
                                        {solutionSteps.map((stepData, index) => (
                                            <ProblemStepCard 
                                                key={index}
                                                step={stepData.step} 
                                                title={stepData.title} 
                                                content={stepData.content} 
                                                delay={index * 0.2}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default AiTools;