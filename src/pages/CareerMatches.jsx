// /src/pages/CareerMatches.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// --- Redesigned, Animated CareerCard Component ---
const CareerCard = ({ career, index }) => {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" }
        }
    };
    
    return (
        <motion.div layout variants={cardVariants} initial="hidden" animate="visible" exit="hidden"
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-dark pr-4">{career.name}</h3>
                <div className="text-center flex-shrink-0">
                    <p className="font-bold text-4xl text-primary">{career.matchScore}%</p>
                    <p className="text-xs font-semibold text-gray-500 tracking-wide">MATCH</p>
                </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-bold text-primary mb-1">Why it's a good match:</h4>
                <p className="text-sm text-gray-600">{career.rationale || "Based on your assessment results."}</p>
            </div>
            <div className="flex items-center gap-6 text-gray-700 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <div>
                        <p className="text-xs text-gray-500">Avg. Salary</p>
                        <p className="font-semibold">₹{career.salary || 'N/A'} LPA</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    <div>
                        <p className="text-xs text-gray-500">Growth</p>
                        <p className="font-semibold">{career.growth || 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs mb-6">
                {career.traits.map((trait, i) => (<span key={i} className="bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full">{trait}</span>))}
            </div>
            <Link to="/exploration-hub" className="mt-auto w-full text-center bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
                Explore Career
            </Link>
        </motion.div>
    );
};

const clusters = ['All', 'Technology', 'Healthcare', 'Creative', 'Business'];

function CareerMatches() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();

    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('match');
    const [activeCluster, setActiveCluster] = useState('All');

    useEffect(() => {
        const fetchCareers = async () => {
            if (!userInfo) return;
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const params = new URLSearchParams({ 
                    cluster: activeCluster === 'All' ? '' : activeCluster, 
                    searchTerm: searchTerm, 
                    sortBy: sortBy 
                });
                const url = `${import.meta.env.VITE_API_URL}/api/careers?${params.toString()}`;
                const { data } = await axios.get(url, config);
                const dataWithScore = data.map(c => ({...c, matchScore: Math.floor(Math.random() * 15) + 85 })); // Dummy score
                setCareers(dataWithScore);
            } catch (err) {
                setError('Failed to load career matches.');
            } finally {
                setLoading(false);
            }
        };
        fetchCareers();
    }, [searchTerm, sortBy, activeCluster, userInfo]);

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Career Matches" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-dark mb-2">Your Personalized Career Matches</h1>
                        <p className="text-gray-600 mb-8">Based on your unique assessment results, here are your top career recommendations.</p>
                    </motion.div>

                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-xl shadow-md mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:col-span-2 p-3 border border-gray-200 rounded-lg" placeholder="Search by career name or keyword..."/>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 border bg-gray-50 border-gray-200 rounded-lg">
                                <option value="match">Sort by Best Match</option><option value="salary">Sort by Highest Salary</option><option value="growth">Sort by Fastest Growth</option>
                            </select>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                {clusters.map((cluster) => (<button key={cluster} onClick={() => setActiveCluster(cluster)} className={`font-semibold px-4 py-1.5 rounded-full text-sm transition-colors ${activeCluster === cluster ? 'bg-primary text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cluster}</button>))}
                            </div>
                        </div>
                    </motion.section>
                    
                    <AnimatePresence>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading career matches...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {careers.length > 0 ? (
                                careers.map((career, index) => <CareerCard key={career._id} career={career} index={index} />)
                            ) : (
                                <p className="text-gray-600 md:col-span-3 text-center mt-8">No careers found matching your criteria. Try adjusting your filters.</p>
                            )}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default CareerMatches;