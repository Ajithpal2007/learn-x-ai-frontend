// /src/pages/StudentProfile.jsx

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register the necessary components for the radar chart
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

// --- UI Component: Profile Section Card ---
const ProfileSection = ({ title, children, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
    >
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        {children}
    </motion.div>
);

function StudentProfile() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userInfo) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/my-profile`, config);
                setProfileData(data);
            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userInfo]);

    // Dummy data for the radar chart - in a real app, this would come from assessment results
    const chartData = {
        labels: ['Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional', 'Realistic'],
        datasets: [{
            label: 'Personality Match',
            data: [85, 70, 75, 90, 60, 50], // Example scores
            backgroundColor: 'rgba(29, 78, 216, 0.2)',
            borderColor: 'rgba(29, 78, 216, 1)',
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: 'rgba(29, 78, 216, 1)',
        }],
    };
    const chartOptions = {
        scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, grid: { color: 'rgba(255, 255, 255, 0.2)' }, pointLabels: { color: '#fff', font: { size: 12 } }, ticks: { display: false, beginAtZero: true, max: 100 } } },
        plugins: { legend: { display: false } }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-dark-bg text-white"><p>Loading profile...</p></div>;
    if (error) return <div className="flex h-screen items-center justify-center bg-dark-bg text-red-400"><p>{error}</p></div>;

    return (
        <div className="flex h-screen bg-dark-bg text-dark-text">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Student Profile" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {profileData && (
                        <>
                            {/* --- Profile Header --- */}
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-dark-card border border-dark-border p-6 rounded-2xl">
                                <img 
                                    className="w-28 h-28 rounded-full border-4 border-primary shadow-lg object-cover" 
                                    src={profileData.profilePictureUrl ? `http://localhost:5000${profileData.profilePictureUrl}` : '/default-avatar.png'} 
                                    alt={profileData.name} 
                                />
                                <div className="text-center md:text-left">
                                    <h1 className="text-4xl font-bold text-white">{profileData.name}</h1>
                                    <p className="text-dark-text-secondary mt-1">Student • Joined {new Date(profileData.createdAt).getFullYear()}</p>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* --- Left Column --- */}
                                <div className="lg:col-span-2 space-y-8">
                                    <ProfileSection title="About Me" delay={0.1}>
                                        <p className="text-dark-text-secondary leading-relaxed">{profileData.personalInfo?.summary || "This student has not written a summary yet."}</p>
                                    </ProfileSection>
                                    <ProfileSection title="My Goals" delay={0.2}>
                                         <p className="text-dark-text-secondary leading-relaxed">{profileData.roadmap?.careerMilestones || "No career goals have been set yet."}</p>
                                    </ProfileSection>
                                </div>

                                {/* --- Right Column --- */}
                                <div className="space-y-8">
                                    <ProfileSection title="Assessment Snapshot" delay={0.3}>
                                        <div className="h-64 flex items-center justify-center">
                                            <Radar data={chartData} options={chartOptions} />
                                        </div>
                                    </ProfileSection>
                                    <ProfileSection title="Top Skills" delay={0.4}>
                                        <div className="flex flex-wrap gap-2">
                                            {/* This would also come from user data eventually */}
                                            {['Python', 'Problem Solving', 'Public Speaking', 'Teamwork', 'Creative Thinking'].map(skill => (
                                                <span key={skill} className="bg-primary/20 text-primary font-semibold px-3 py-1 rounded-full text-sm">{skill}</span>
                                            ))}
                                        </div>
                                    </ProfileSection>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default StudentProfile;