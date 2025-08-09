// /src/pages/MyLearningDashboard.jsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the necessary components for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- UI Component: Learning Path Step ---
const LearningStep = ({ icon, title, status, delay, isLast }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="relative pl-10"
    >
        {/* The vertical connector line */}
        {!isLast && <div className="absolute top-5 left-4 h-full w-0.5 bg-dark-border"></div>}

        {/* The icon circle */}
        <div className={`absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            status === 'Completed' ? 'bg-secondary' : status === 'In Progress' ? 'bg-primary' : 'bg-dark-border'
        }`}>
            <span className="text-white font-bold">{icon}</span>
        </div>

        <div className="flex items-center">
            <div>
                <p className={`font-bold ${status === 'In Progress' ? 'text-primary' : 'text-white'}`}>{title}</p>
                <p className="text-sm text-dark-text-secondary">{status}</p>
            </div>
        </div>
    </motion.div>
);

// --- UI Component: Recommendation Card ---
const RecommendationCard = ({ title, description, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-dark-card border border-dark-border rounded-xl p-6 h-full"
    >
        <h4 className="font-bold text-white text-lg">{title}</h4>
        <p className="text-dark-text-secondary mt-2 text-sm">{description}</p>
    </motion.div>
);


function MyLearningDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    // In a real app, this data would be fetched from the backend based on user progress
    const learningPath = [
        { icon: "✓", title: "Module 1: Foundations of Mathematics", status: "Completed" },
        { icon: "✓", title: "Module 2: Advanced Algebra", status: "Completed" },
        { icon: "⏳", title: "Module 3: Calculus Fundamentals", status: "In Progress" },
        { icon: "→", title: "Module 4: Introduction to Statistics", status: "Upcoming" },
        { icon: "→", title: "Module 5: Linear Algebra Basics", status: "Upcoming" },
    ];

    const chartData = {
        labels: ['Maths', 'Physics', 'Chemistry', 'English'],
        datasets: [{
            label: 'Predicted Score',
            data: [85, 88, 75, 92],
            backgroundColor: 'rgba(29, 78, 216, 0.7)',
            borderColor: 'rgba(29, 78, 216, 1)',
            borderWidth: 1,
            borderRadius: 8,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: true, text: 'Predicted Performance in Upcoming Exams', color: '#9CA3AF' } },
        scales: {
            y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
            x: { ticks: { color: '#9CA3AF' }, grid: { display: false } }
        }
    };

    return (
        <div className="flex h-screen bg-dark-bg text-dark-text">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="My Learning" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-white mb-2">My Learning Dashboard</h1>
                        <p className="text-dark-text-secondary mb-10">Track your progress and discover personalized learning recommendations.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Learning Path */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 bg-dark-card border border-dark-border rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">Your Adaptive Learning Path</h3>
                            <div className="space-y-6">
                                {learningPath.map((step, i) => <LearningStep key={i} {...step} delay={i * 0.1} isLast={i === learningPath.length - 1} />)}
                            </div>
                        </motion.div>

                        {/* Right Column: Predictions & Recommendations */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-dark-card border border-dark-border rounded-xl p-6">
                                <div className="h-80">
                                    <Bar options={chartOptions} data={chartData} />
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <h3 className="text-xl font-bold text-white mb-4">Personalized Recommendations</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <RecommendationCard title="Focus Area: Derivatives" description="Your recent performance suggests focusing on calculus. Try these practice problems." delay={0.4} />
                                    <RecommendationCard title="New Resource: Organic Chemistry" description="A new video series on isomerism has been added. Check it out!" delay={0.5} />
                                    <RecommendationCard title="Skill Tip: Active Recall" description="Improve memory retention by actively recalling concepts instead of just re-reading them." delay={0.6} />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MyLearningDashboard;