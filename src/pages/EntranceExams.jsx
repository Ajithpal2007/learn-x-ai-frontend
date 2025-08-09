// /src/pages/EntranceExams.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const examCategories = [
    { name: "Engineering", icon: "🔧" },
    { name: "Medical", icon: "🩺" },
    { name: "Law", icon: "⚖️" },
    { name: "Management", icon: "📈" },
    { name: "Design", icon: "🎨" },
];

// --- NEW UI Component: ExamListItem ---
const ExamListItem = ({ exam, selectedExam, setSelectedExam }) => (
    <motion.button
        onClick={() => setSelectedExam(exam)}
        className={`w-full text-left p-3 rounded-lg font-semibold transition-colors text-base relative ${selectedExam?._id === exam._id ? 'text-white' : 'text-dark-text-secondary hover:bg-dark-border'}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        {selectedExam?._id === exam._id && (
            <motion.div layoutId="activeExam" className="absolute inset-0 bg-primary/50 rounded-lg" />
        )}
        <span className="relative z-10">{exam.name}</span>
    </motion.button>
);

// --- NEW UI Component: ExamDetailCard ---
const ExamDetailCard = ({ exam }) => {
    const detailVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: 'easeIn' } }
    };
    const DetailSection = ({ title, children }) => (
        <div>
            <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
            <p className="text-dark-text-secondary leading-relaxed">{children}</p>
        </div>
    );
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={exam._id}
                variants={detailVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-dark-card border border-dark-border rounded-xl p-8"
            >
                <h2 className="text-3xl font-bold text-white mb-2">{exam.fullName}</h2>
                <p className="text-primary font-semibold text-lg mb-6">{exam.name}</p>
                <div className="space-y-5">
                    <DetailSection title="Purpose">{exam.purpose}</DetailSection>
                    <DetailSection title="Eligibility">{exam.eligibility}</DetailSection>
                    <DetailSection title="Exam Pattern">{exam.pattern}</DetailSection>
                    <DetailSection title="Core Syllabus">{exam.syllabus}</DetailSection>
                    <motion.a 
                        href={`https://${exam.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block mt-4 text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-blue-600"
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(29, 78, 216, 0.7)" }}
                    >
                        Official Website →
                    </motion.a>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};


function EntranceExams() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedExam, setSelectedExam] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/entrance-exams`, config);
                setExams(data);
                if (data.length > 0) {
                    setSelectedExam(data[0]); // Select the first exam by default
                }
            } catch (err) {
                setError('Failed to load exam data.');
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="flex h-screen bg-dark-bg text-dark-text">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Entrance Exams" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-white mb-2">Entrance Exam Browser</h1>
                        <p className="text-dark-text-secondary mb-8">Your complete guide to major entrance exams for higher education in India.</p>
                    </motion.div>

                    {loading && <p className="text-white text-center">Loading exam data...</p>}
                    {error && <p className="p-4 bg-red-900/50 text-red-300 rounded-lg text-center">{error}</p>}
                    
                    {!loading && !error && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Left Column: Exam List */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 bg-dark-card border border-dark-border rounded-xl p-4 space-y-4 lg:sticky lg:top-8">
                                {examCategories.map(category => (
                                    <div key={category.name}>
                                        <h3 className="text-lg font-bold text-white px-2 mb-2 flex items-center gap-2">
                                            <span>{category.icon}</span>{category.name}
                                        </h3>
                                        <div className="space-y-1">
                                            {exams.filter(e => e.category === category.name).map(exam => (
                                                <ExamListItem key={exam._id} exam={exam} selectedExam={selectedExam} setSelectedExam={setSelectedExam} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                            
                            {/* Right Column: Exam Details */}
                            <div className="lg:col-span-2">
                                {selectedExam && <ExamDetailCard exam={selectedExam} />}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default EntranceExams;