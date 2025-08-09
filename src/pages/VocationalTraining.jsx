// /src/pages/VocationalTraining.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';

// --- NEW UI Component: CourseCard ---
// A stylish, interactive card for each vocational course.
const CourseCard = ({ course, index }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            className="bg-dark-card border border-dark-border rounded-xl flex flex-col overflow-hidden group transition-all duration-300 hover:border-primary hover:-translate-y-1"
        >
            <div className="overflow-hidden">
                <motion.img
                    src={course.image || 'https://via.placeholder.com/400x225/1D4ED8/FFFFFF?text=Skill'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                />
            </div>
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs mb-3">
                    {/* Add tags to your data for more dynamic content */}
                    <span className="font-bold uppercase text-primary bg-primary/10 px-2 py-1 rounded">HANDS-ON</span>
                </div>
                <h3 className="text-xl font-bold text-white flex-1">{course.title}</h3>
                <p className="text-dark-text-secondary mt-2 mb-4 text-sm">{course.description}</p>
                <button className="mt-auto w-full text-center bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
                    View Program
                </button>
            </div>
        </motion.div>
    );
};

// --- NEW UI Component: FeaturedCourseCard ---
// A larger, more prominent card to highlight a specific program.
const FeaturedCourseCard = ({ course }) => (
     <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-2xl flex flex-col md:flex-row items-center overflow-hidden"
    >
        <img
            src={course.image || 'https://via.placeholder.com/600x400/1D4ED8/FFFFFF?text=Featured'}
            alt={course.title}
            className="w-full md:w-1/2 h-64 object-cover"
        />
        <div className="p-8 md:p-10">
            <p className="text-secondary font-semibold mb-2">Featured Program</p>
            <h3 className="text-3xl font-extrabold text-white">{course.title}</h3>
            <p className="text-dark-text-secondary mt-3 mb-6">{course.description}</p>
            <button className="bg-secondary text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors">
                Explore Details
            </button>
        </div>
    </motion.div>
);


function VocationalTraining() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/vocational-courses`, config);
                setCourses(data);
            } catch (err) {
                setError('Failed to load vocational courses.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const featuredCourse = courses.length > 0 ? courses[0] : null;
    const otherCourses = courses.length > 1 ? courses.slice(1) : [];

    return (
        <div className="flex h-screen bg-dark-bg text-dark-text">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Vocational Training" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
                        <h1 className="text-5xl font-extrabold text-white">Hands-On Skill Development</h1>
                        <p className="text-lg text-dark-text-secondary mt-2">Explore practical, skill-focused education for high-demand industries in India.</p>
                    </motion.div>

                    {loading && <p className="text-center">Loading courses...</p>}
                    {error && <p className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</p>}

                    {!loading && !error && (
                        <div className="space-y-16">
                            {/* Featured Program Section */}
                            {featuredCourse && (
                                <section>
                                    <FeaturedCourseCard course={featuredCourse} />
                                </section>
                            )}

                            {/* All Courses Section */}
                            {otherCourses.length > 0 && (
                                <section>
                                    <h2 className="text-3xl font-bold text-white mb-6">Browse All Programs</h2>
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    >
                                        {otherCourses.map((course, i) => (
                                            <CourseCard key={course._id} course={course} index={i} />
                                        ))}
                                    </motion.div>
                                </section>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default VocationalTraining;