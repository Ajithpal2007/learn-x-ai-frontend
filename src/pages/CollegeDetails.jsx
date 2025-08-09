import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';

function CollegeDetails() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const { id } = useParams(); // Get college ID from the URL
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/colleges/${id}`, config);
                setCollege(data);
            } catch (err) {
                setError('Failed to load college details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchCollege();
    }, [id]);

    if (loading) return <div className="flex h-screen items-center justify-center"><p>Loading details...</p></div>;
    if (error) return <div className="flex h-screen items-center justify-center"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="College Details" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto">
                    {college && (
                        <>
                            {/* Banner Image */}
                            <div className="h-64 bg-gray-200">
                                <img src={college.image} alt={college.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="p-6 md:p-8">
                                {/* Header Section */}
                                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                                    <h1 className="text-4xl font-bold text-dark">{college.name}</h1>
                                    <p className="text-gray-600 mt-1">{college.location}</p>
                                    <div className="flex items-center gap-6 mt-4">
                                        <button className="bg-primary/10 text-primary font-semibold py-2 px-6 rounded-lg">Save</button>
                                        <a href={college.brochureUrl} target="_blank" rel="noreferrer" className="bg-secondary text-white font-semibold py-2 px-6 rounded-lg">Download Brochure</a>
                                    </div>
                                </motion.div>

                                {/* Details Section */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10 bg-white p-8 rounded-xl shadow-md space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-dark mb-2">Overview</h3>
                                        <p className="text-gray-700 leading-relaxed">{college.description}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-dark mb-2">Top Courses</h3>
                                        <div className="flex flex-wrap gap-2">{college.courses.map(course => <span key={course} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{course}</span>)}</div>
                                    </div>
                                     <div>
                                        <h3 className="text-xl font-bold text-dark mb-2">Placements</h3>
                                        <p className="text-gray-700 leading-relaxed">{college.placements}</p>
                                    </div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default CollegeDetails;