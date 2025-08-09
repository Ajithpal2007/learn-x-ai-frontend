// /src/pages/BoardExamPrep.jsx

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- NEW Light-Theme Custom Dropdown ---
const CustomDropdown = ({ options, selected, onSelect, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="text-sm font-medium text-gray-500 mb-1 block">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-white border-2 border-gray-200 text-dark rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
            >
                <span className="font-semibold">{selected}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        // --- FIX: Added z-index to ensure it appears above other content ---
                        className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl"
                    >
                        {options.map(option => (
                            <button
                                key={option}
                                onClick={() => { onSelect(option); setIsOpen(false); }}
                                className="w-full text-left font-semibold px-4 py-3 text-dark hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                                {option}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


function BoardExamPrep() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const [selectedClass, setSelectedClass] = useState('Class 12');
    const [selectedBoard, setSelectedBoard] = useState('CBSE');
    
    const [prepData, setPrepData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [activeResourceTab, setActiveResourceTab] = useState('textbooks');

    useEffect(() => {
        const studentClass = selectedClass.split(' ')[1];
        if (!studentClass || !selectedBoard) { setPrepData(null); return; }
        
        const fetchPrepData = async () => {
            setLoading(true); setError('');
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const url = `${import.meta.env.VITE_API_URL}/api/board-prep?studentClass=${studentClass}&board=${selectedBoard}`;
                const { data } = await axios.get(url, config);
                setPrepData(data);
            } catch (err) {
                setError('Could not find prep data. More guides are being added!');
                setPrepData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPrepData();
    }, [selectedClass, selectedBoard]);

    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } }
    };

    return (
        // --- FIX: Using light theme background ---
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Board Exam Preparation" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-dark">Board Exam Prep Guide</h1>
                        <p className="text-lg text-gray-600 mt-2">Your personalized guide for {selectedClass} - {selectedBoard}</p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.2 }}
                            // --- FIX: Added z-index-10 to the parent of the dropdowns ---
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10"
                        >
                             <CustomDropdown 
                                label="Select Class"
                                options={['Class 10', 'Class 12']}
                                selected={selectedClass}
                                onSelect={setSelectedClass}
                             />
                             <CustomDropdown 
                                label="Select Board"
                                options={['CBSE', 'ICSE']}
                                selected={selectedBoard}
                                onSelect={setSelectedBoard}
                             />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-xl">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div key="loader" {...contentVariants} className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading your guide...</p></motion.div>
                                ) : error ? (
                                     <motion.div key="error" {...contentVariants} className="min-h-[400px] flex items-center justify-center p-6"><p className="text-yellow-600 bg-yellow-50 p-4 rounded-lg">{error}</p></motion.div>
                                ) : prepData && (
                                    <motion.div key="content" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                        <div className="p-8 border-b border-gray-200">
                                            <h3 className="text-2xl font-bold text-dark mb-2">Exam Overview</h3>
                                            <p className="text-gray-600 leading-relaxed">{prepData.examInformation}</p>
                                        </div>
                                        <div className="p-8">
                                            <h3 className="text-2xl font-bold text-dark mb-4">Study Resources</h3>
                                            <div className="flex border-b border-gray-200 mb-4">
                                                <button onClick={() => setActiveResourceTab('textbooks')} className={`px-5 py-2 font-semibold ${activeResourceTab === 'textbooks' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}>Textbooks</button>
                                                <button onClick={() => setActiveResourceTab('samplePapers')} className={`px-5 py-2 font-semibold ${activeResourceTab === 'samplePapers' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}>Sample Papers</button>
                                                <button onClick={() => setActiveResourceTab('mockTests')} className={`px-5 py-2 font-semibold ${activeResourceTab === 'mockTests' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}>Mock Tests</button>
                                            </div>
                                            <AnimatePresence mode="wait">
                                                <motion.p key={activeResourceTab} variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="text-gray-600 leading-relaxed">
                                                    {prepData.studyResources[activeResourceTab]}
                                                </motion.p>
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default BoardExamPrep;