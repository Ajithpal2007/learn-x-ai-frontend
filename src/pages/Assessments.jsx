// /src/pages/Assessments.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- Redesigned, Multi-State AssessmentCard Component ---
const AssessmentCard = ({ assessment, onTakeTest, index }) => {
    const { _id, assessmentName, description, status, progress, assessmentType } = assessment;

    const ICONS = {
        Aptitude: '🧠',
        Interest: '🎯',
        Personality: '👤',
        Values: '💖'
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" }
        }
    };

    const getStatusStyles = () => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-400';
            case 'In Progress': return 'bg-yellow-500/10 text-yellow-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            className="bg-dark-card border border-dark-border rounded-2xl flex flex-col h-full p-6 transition-all duration-300 hover:border-primary/70 hover:-translate-y-1"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{ICONS[assessmentType] || '📝'}</div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyles()}`}>{status}</div>
            </div>
            <h3 className="text-xl font-bold text-white flex-grow">{assessmentName}</h3>
            <p className="text-dark-text-secondary my-3 text-sm">{description || 'No description available.'}</p>
            
            {status === 'In Progress' && (
              <div className="mt-auto mb-4">
                  <div className="w-full bg-dark-border rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress || 0}%` }}></div></div>
              </div>
            )}

            <div className="mt-auto">
                {status === 'Pending' && <button onClick={() => onTakeTest(_id)} className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors">Start Test</button>}
                {status === 'In Progress' && <button onClick={() => onTakeTest(_id)} className="w-full bg-yellow-500/80 text-white font-bold py-2.5 rounded-lg hover:bg-yellow-600 transition-colors">Continue Test</button>}
                {status === 'Completed' && <button className="w-full bg-secondary text-white font-bold py-2.5 rounded-lg hover:bg-green-600 transition-colors">View Results</button>}
            </div>
        </motion.div>
    );
};

function Assessments() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAssessments = async () => {
        if(!loading) setLoading(true); 
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/assessments', config);
            setAssessments(data);
        } catch (err) {
            setError('Failed to load assessments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(userInfo) fetchAssessments();
    }, [userInfo]);

    const handleTakeTest = async (assessmentId) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const body = { 
                results: { score: Math.floor(Math.random() * 30) + 70 },
                status: 'Completed' // We'll just complete it for this example
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/assessments/${assessmentId}`, body, config);
            fetchAssessments(); // Refetch to show the updated status
        } catch (err) {
            setError('Failed to update assessment status. Please try again.');
        }
    };

    const aptitudeTests = assessments.filter(a => a.assessmentType === 'Aptitude');
    const interestProfilers = assessments.filter(a => a.assessmentType === 'Interest');
    const personalityTests = assessments.filter(a => a.assessmentType === 'Personality');
    const valuesTests = assessments.filter(a => a.assessmentType === 'Values'); 

    return (
        <div className="flex h-screen bg-dark-bg text-dark-text">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Assessments" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold text-white">Unlock Your Potential</h1>
                        <p className="text-lg text-dark-text-secondary mt-2 max-w-3xl mx-auto">Complete these assessments to build your personalized career profile and unlock tailored recommendations.</p>
                    </motion.div>

                    {loading && <p className="text-center">Loading your assessments...</p>}
                    {error && <p className="text-center text-red-400">{error}</p>}
                    
                    {!loading && !error && (
                        <motion.div initial="hidden" animate="visible" className="space-y-12 max-w-7xl mx-auto">
                            <section>
                                <h2 className="text-3xl font-bold text-white mb-6">Aptitude Tests</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {aptitudeTests.map((test, i) => <AssessmentCard key={test._id} assessment={test} onTakeTest={handleTakeTest} index={i} />)}
                                </div>
                            </section>
                            
                            <section>
                                <h2 className="text-3xl font-bold text-white mb-6">Interest & Personality</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {interestProfilers.map((test, i) => <AssessmentCard key={test._id} assessment={test} onTakeTest={handleTakeTest} index={i} />)}
                                    {personalityTests.map((test, i) => <AssessmentCard key={test._id} assessment={test} onTakeTest={handleTakeTest} index={i + interestProfilers.length} />)}
                                </div>
                            </section>
                            
                            <section>
                                <h2 className="text-3xl font-bold text-white mb-6">Values Clarification</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {valuesTests.map((test, i) => <AssessmentCard key={test._id} assessment={test} onTakeTest={handleTakeTest} index={i} />)}
                                </div>
                            </section>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Assessments;