// /src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// --- UI Components for the Dashboard ---
const StatCard = ({ icon, title, value, bgColor, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-dark">{value}</p>
        </div>
        <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center text-primary`}>
            {icon}
        </div>
    </motion.div>
);

const InsightCard = ({ icon, title, text, link, linkText, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-gray-50 p-5 rounded-lg flex items-start gap-4"
    >
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-dark">{title}</h4>
            <p className="text-sm text-gray-600 mb-2">{text}</p>
            <Link to={link} className="text-sm font-semibold text-primary hover:underline">{linkText} →</Link>
        </div>
    </motion.div>
);

const ActivityItem = ({ item, delay }) => {
    const ICONS = {
        College: '🏛️',
        Career: '💼',
        Resource: '📚'
    };
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0"
        >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">{ICONS[item.type]}</div>
            <div>
                <p className="text-sm text-gray-500">You saved a {item.type}</p>
                <p className="font-semibold text-dark">{item.name || item.title}</p>
            </div>
        </motion.div>
    );
};

function Dashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userInfo) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/dashboard`, config);
                setDashboardData(data);
            } catch (err) {
                setError('Could not load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [userInfo]);

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Dashboard" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-bold text-dark mb-1">Welcome back, {userInfo?.name.split(' ')[0]}! 👋</h1>
                        <p className="text-gray-600">Let's continue your journey to career clarity.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="bg-gradient-to-br from-primary to-blue-700 text-white p-8 rounded-2xl shadow-xl mb-8">
                        <h2 className="text-2xl font-bold mb-2">Your Next Step</h2>
                        <p className="text-blue-100 max-w-2xl mb-6">Complete your remaining assessments to unlock a deeply personalized career roadmap.</p>
                        <Link to="/assessments" className="bg-white text-primary font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-100 transition-transform hover:scale-105 inline-block">
                            Go to Assessments
                        </Link>
                    </motion.div>

                    {loading && <p className="text-center text-gray-500">Loading dashboard...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {dashboardData && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <StatCard
                                    title="Assessments"
                                    value={`${dashboardData.assessments.completed}/${dashboardData.assessments.total}`}
                                    bgColor="bg-blue-100"
                                    icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>}
                                    delay={0.2}
                                />
                                <StatCard
                                    title="Career Matches"
                                    value={dashboardData.careerMatchesUnlocked}
                                    bgColor="bg-green-100"
                                    icon={<svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
                                    delay={0.3}
                                />
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-md transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-1"><p className="text-sm font-medium text-gray-500">Roadmap Progress</p><p className="font-bold text-dark">{dashboardData.roadmapProgress}%</p></div>
                                    <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-secondary h-3 rounded-full" style={{ width: `${dashboardData.roadmapProgress}%` }}></div></div>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="text-xl font-semibold text-dark mb-4">AI-Powered Insights</h3>
                                    <div className="space-y-4">
                                        <InsightCard icon={"💡"} title="High Analytical Score" text="Your assessments show strong analytical skills. This is a great trait for careers in tech and finance." link="/career-matches" linkText="See Analytical Careers" delay={0.5}/>
                                        <InsightCard icon={"📚"} title="Resource Recommendation" text="Based on your interest in technology, check out our curated list of articles and videos." link="/resource-library" linkText="Go to Resources" delay={0.6}/>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h3 className="text-xl font-semibold text-dark mb-4">Recent Activity</h3>
                                    {/* --- THIS IS THE FIX --- */}
                                    {/* Using optional chaining (?.) to prevent the crash */}
                                    {dashboardData?.recentActivity?.length > 0 ? (
                                        <div className="space-y-2">
                                            {dashboardData.recentActivity.map((item, index) => (
                                                <ActivityItem key={index} item={item} delay={0.5 + index * 0.1} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center mt-8">Your recent saved items will appear here.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;