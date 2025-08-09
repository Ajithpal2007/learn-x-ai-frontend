// /src/pages/FindAMentor.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- UI Component: Featured Mentor Card (Light Theme) ---
const FeaturedMentorCard = ({ mentor, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100 flex flex-col h-full hover:shadow-xl hover:-translate-y-1.5 transition-all"
    >
        <img src={mentor.img} alt={mentor.name} className="w-28 h-28 rounded-full mx-auto mb-4 shadow-lg border-2 border-primary" />
        <h3 className="text-xl font-bold text-dark">{mentor.name}</h3>
        <p className="text-primary font-semibold text-sm mb-3">{mentor.field}</p>
        <p className="text-gray-600 text-sm flex-grow mb-4">{mentor.bio}</p>
        <button className="mt-auto bg-primary/10 text-primary font-bold py-2.5 px-6 rounded-lg hover:bg-primary/20 transition-colors">
            View Profile
        </button>
    </motion.div>
);

// --- UI Component: Mentor List Item (Light Theme) ---
const MentorListItem = ({ mentor, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-primary transition-colors"
    >
        <img src={mentor.img} alt={mentor.name} className="w-16 h-16 rounded-full" />
        <div className="flex-1">
            <h3 className="font-bold text-lg text-dark">{mentor.name}</h3>
            <p className="text-sm text-gray-500">{mentor.title}</p>
        </div>
        <button className="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-dark transition-colors">
            Connect
        </button>
    </motion.div>
);

function FindAMentor() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMentors = async () => {
            if (!userInfo) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/mentors`, config);
                setMentors(data);
            } catch (err) {
                setError('Failed to load mentor data.');
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, [userInfo]);

    const filteredMentors = mentors.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.field.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Find a Mentor" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-dark mb-2">Connect with Industry Experts</h1>
                        <p className="text-gray-600 mb-8">Get guidance from experienced professionals in your field of interest.</p>
                        <input 
                            type="text" 
                            placeholder="Search for mentors by name, field (e.g., Technology)..." 
                            className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg p-4 mb-10 text-dark placeholder-gray-500 focus:ring-2 focus:ring-primary outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </motion.div>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading mentors...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="space-y-16">
                            {/* Featured Mentors Section */}
                            <section>
                                <h2 className="text-2xl font-bold text-dark mb-6">Featured Mentors</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {filteredMentors.slice(0, 3).map((mentor, i) => (
                                        <FeaturedMentorCard key={mentor._id} mentor={mentor} delay={i * 0.1} />
                                    ))}
                                </div>
                            </section>

                            {/* All Mentors Section */}
                            {filteredMentors.length > 3 && (
                                <section>
                                    <h2 className="text-2xl font-bold text-dark mb-6">Browse All Mentors</h2>
                                    <div className="space-y-4">
                                        {filteredMentors.slice(3).map((mentor, i) => <MentorListItem key={mentor._id} mentor={mentor} index={i} />)}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default FindAMentor;