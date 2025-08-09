import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// --- UI Component: StatCard ---
const StatCard = ({ title, value, icon, link, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Link to={link} className="block bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-4xl font-bold text-dark mt-1">{value}</p>
                </div>
                <div className="text-3xl bg-primary/10 text-primary p-3 rounded-xl">{icon}</div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Click to manage →</p>
        </Link>
    </motion.div>
);

function AdminDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, config);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        if (userInfo?.isAdmin) {
            fetchStats();
        }
    }, [userInfo]);

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Admin Dashboard" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-dark mb-8">
                        Welcome, {userInfo?.name}!
                    </motion.h1>

                    {loading ? (
                        <p>Loading stats...</p>
                    ) : stats ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard title="Total Users" value={stats.users} icon="👥" link="/admin/users" delay={0.1} />
                            <StatCard title="Total Colleges" value={stats.colleges} icon="🏛️" link="/admin/colleges" delay={0.2} />
                            <StatCard title="Total Careers" value={stats.careers} icon="💼" link="/admin/careers" delay={0.3} />
                            <StatCard title="Total Scholarships" value={stats.scholarships} icon="🏆" link="/admin/scholarships" delay={0.4} />
                            
                           <StatCard title="Manage Submissions" value={stats.newSubmissions} icon="📨" link="/admin/submissions" delay={0.5} />
                        </div>
                    ) : (
                        <p>Could not load dashboard data.</p>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;