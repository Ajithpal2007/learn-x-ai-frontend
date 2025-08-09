// /src/pages/SkillBuilding.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- UI Component: Section Header ---
const SectionHeader = ({ icon, title, delay }) => ( 
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-center md:text-left"
    >
        <h2 className="text-3xl font-bold text-dark mb-6 flex items-center justify-center md:justify-start gap-3">
            <span className="text-2xl">{icon}</span>
            {title}
        </h2>
    </motion.div>
);

// --- UI Component: Opportunity Card ---
const OpportunityCard = ({ title, description, buttonText, link = "#", delay }) => ( 
    <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay }} 
        viewport={{ once: true, amount: 0.5 }} 
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col h-full hover:shadow-xl hover:-translate-y-1.5 transition-all"
    >
        <h3 className="text-xl font-bold text-dark">{title}</h3>
        <p className="text-gray-600 my-2 flex-grow">{description}</p>
        <a 
            href={link} 
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-center w-full bg-primary/10 text-primary font-semibold py-2.5 rounded-lg hover:bg-primary/20 transition-colors"
        >
            {buttonText}
        </a>
    </motion.div> 
);

function SkillBuilding() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOpportunities = async () => {
            if (!userInfo) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/opportunities`, config);
                setOpportunities(data);
            } catch (err) {
                setError('Failed to load skill building opportunities.');
            } finally {
                setLoading(false);
            }
        };
        fetchOpportunities();
    }, [userInfo]);

    const getButtonText = (category) => {
        switch (category) {
            case 'Internship': return 'Apply Now';
            case 'Project': return 'Get Ideas';
            case 'Shadowing': return 'Find Opportunities';
            default: return 'Find Courses';
        }
    };

    const microSkills = opportunities.filter(o => o.category === 'Micro-Skill');
    const internships = opportunities.filter(o => o.category === 'Internship');
    const projects = opportunities.filter(o => o.category === 'Project');
    const shadowing = opportunities.filter(o => o.category === 'Shadowing');

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Skill Building" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl font-extrabold text-dark">Develop In-Demand Skills</h1>
                        <p className="text-lg text-gray-600 mt-2">Explore opportunities to gain relevant experience and enhance your profile.</p>
                    </motion.div>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading opportunities...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="space-y-16 max-w-7xl mx-auto">
                            <section>
                                <SectionHeader icon="🎓" title="Micro-Skills & Certifications" delay={0.1} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {microSkills.map((item, i) => <OpportunityCard key={item._id} {...item} buttonText={getButtonText(item.category)} delay={i * 0.1} />)}
                                </div>
                            </section>
                            <section>
                                <SectionHeader icon="🏢" title="Internships & Volunteering" delay={0.2} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {internships.map((item, i) => <OpportunityCard key={item._id} {...item} buttonText={getButtonText(item.category)} delay={i * 0.1} />)}
                                </div>
                            </section>
                            <section>
                                <SectionHeader icon="💡" title="Project Ideas & Competitions" delay={0.3} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.map((item, i) => <OpportunityCard key={item._id} {...item} buttonText={getButtonText(item.category)} delay={i * 0.1} />)}
                                </div>
                            </section>
                            <section>
                                <SectionHeader icon="👥" title="Shadowing Experiences" delay={0.4} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {shadowing.map((item, i) => <OpportunityCard key={item._id} {...item} buttonText={getButtonText(item.category)} delay={i * 0.1} />)}
                                </div>
                            </section>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default SkillBuilding;