import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';

// --- NEW UI Component: Upgraded SkillCard ---
const SkillCard = ({ title, icon, description, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        viewport={{ once: true, amount: 0.5 }}
        className="group relative bg-dark-card border border-dark-border rounded-xl p-6 text-center overflow-hidden h-full flex flex-col items-center justify-center"
    >
        {/* Adds a stylish background glow on hover */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
        <div className="relative z-10">
            <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-5xl mb-4"
            >
                {icon}
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-dark-text-secondary text-sm">{description}</p>
        </div>
    </motion.div>
);

// --- NEW UI Component: FounderSpotlight Card ---
const FounderSpotlight = ({ name, title, story, image, traits, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
    >
        <div className="text-center md:text-left">
            <img src={image} alt={name} className="w-28 h-28 rounded-full mx-auto md:mx-0 mb-4 shadow-lg border-2 border-primary" />
            <h4 className="text-2xl font-bold text-white">{name}</h4>
            <p className="text-md text-primary font-semibold">{title}</p>
        </div>
        <div className="flex-1">
            <p className="text-dark-text-secondary text-base mb-4 italic">"{story}"</p>
            <div className="space-y-3">
                {traits.map(trait => (
                    <div key={trait.name}>
                        <div className="flex justify-between text-sm font-medium text-dark-text-secondary mb-1">
                            <span>{trait.name}</span>
                            <span>{trait.score}%</span>
                        </div>
                        <div className="w-full bg-dark-border rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${trait.score}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="bg-gradient-to-r from-primary to-blue-400 h-2 rounded-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);


function EntrepreneurshipHub() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const coreSkills = [
        { icon: "💡", title: "Innovation", description: "Generating novel ideas" },
        { icon: "🤔", title: "Problem-Solving", description: "Finding viable solutions" },
        { icon: "📈", title: "Business Acumen", description: "Understanding market dynamics" },
        { icon: "📢", title: "Marketing", description: "Communicating value" },
        { icon: "💰", title: "Financial Literacy", description: "Managing capital" },
        { icon: "🤝", title: "Networking", description: "Building connections" },
    ];
    
    return (
        <div className="flex h-screen bg-dark-bg text-dark-text">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Entrepreneurship Hub" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -30 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl font-extrabold text-white">
                            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Future</span>
                        </h1>
                        <p className="text-lg text-dark-text-secondary mt-3 max-w-2xl mx-auto">Your gateway to exploring startups, innovation, and independent work in India.</p>
                    </motion.div>
                    
                    <div className="space-y-16">
                        {/* Skill Development Section */}
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-6 text-center md:text-left">Essential Entrepreneurial Skills</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {coreSkills.map((skill, i) => <SkillCard key={skill.title} {...skill} index={i} />)}
                            </div>
                        </section>

                        {/* Founder Spotlight Section */}
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-6 text-center md:text-left">Founder Spotlights</h2>
                            <div className="space-y-8">
                                <FounderSpotlight 
                                    name="Aarav Sharma" 
                                    title="Founder of EduTech Solutions" 
                                    story="From a college dorm to a thriving edtech company, my journey was fueled by a passion for solving a single, impactful problem." 
                                    image="https://i.pravatar.cc/150?u=aarav"
                                    traits={[
                                        { name: "Resilience", score: 95 },
                                        { name: "Vision", score: 90 },
                                        { name: "Execution", score: 85 },
                                    ]}
                                    delay={0.1}
                                />
                                <FounderSpotlight 
                                    name="Priya Verma" 
                                    title="Leading Freelance UX Designer" 
                                    story="I left my corporate job to build a freelance career on my own terms. It's about blending creativity with disciplined client management." 
                                    image="https://i.pravatar.cc/150?u=priyaverma"
                                    traits={[
                                        { name: "Creativity", score: 98 },
                                        { name: "Discipline", score: 90 },
                                        { name: "Communication", score: 88 },
                                    ]}
                                    delay={0.3}
                                />
                            </div>
                        </section>

                        {/* NEW: Idea Launchpad Section */}
                        <motion.section
                             initial={{ opacity: 0 }}
                             whileInView={{ opacity: 1 }}
                             transition={{ duration: 0.7 }}
                             viewport={{ once: true }}
                        >
                            <div className="bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-8 text-center text-white shadow-xl">
                                <h2 className="text-4xl font-bold mb-4">Idea Launchpad</h2>
                                <p className="max-w-xl mx-auto mb-6">Got an idea? See what it takes to launch it. Select a field to explore potential pathways.</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <motion.button whileHover={{ scale: 1.05 }} className="bg-white/20 hover:bg-white/30 font-semibold py-2 px-5 rounded-full backdrop-blur-sm">🚀 Tech Startup</motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} className="bg-white/20 hover:bg-white/30 font-semibold py-2 px-5 rounded-full backdrop-blur-sm">🎨 Creative Agency</motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} className="bg-white/20 hover:bg-white/30 font-semibold py-2 px-5 rounded-full backdrop-blur-sm">🌱 Social Enterprise</motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} className="bg-white/20 hover:bg-white/30 font-semibold py-2 px-5 rounded-full backdrop-blur-sm">🛍️ E-commerce Brand</motion.button>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EntrepreneurshipHub;