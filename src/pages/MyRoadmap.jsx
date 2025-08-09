// /src/pages/MyRoadmap.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- Redesigned UI Component: SuggestionCard (Light Theme) ---
const SuggestionCard = ({ title, description, icon, delay }) => (
    <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white border border-gray-100 shadow-sm p-5 rounded-xl flex items-start gap-4"
    >
        <div className="text-3xl mt-1 bg-primary/10 text-primary p-3 rounded-lg">{icon}</div>
        <div>
            <h4 className="font-bold text-lg text-dark">{title}</h4>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </motion.div>
);

// --- Redesigned UI Component: GoalCard (Light Theme) ---
const GoalCard = ({ goal, onToggle, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
        className={`p-4 rounded-lg flex items-center gap-4 cursor-pointer transition-all ${goal.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-primary/10'}`}
        onClick={onToggle}
    >
        <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 flex-shrink-0 ${goal.completed ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
            {goal.completed && <motion.svg initial={{pathLength: 0}} animate={{pathLength: 1}} className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></motion.svg>}
        </div>
        <span className={`font-semibold ${goal.completed ? 'text-gray-400 line-through' : 'text-dark'}`}>{goal.text}</span>
    </motion.div>
);

// --- NEW UI Component: TimelineSection ---
// This component creates the beautiful timeline structure.
const TimelineSection = ({ title, children, delay }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative pl-8"
    >
        {/* The vertical line for the timeline */}
        <div className="absolute top-0 left-3 h-full w-0.5 bg-gray-200"></div>
        {/* The circle on the timeline */}
        <div className="absolute top-1 left-0 w-6 h-6 bg-primary rounded-full border-4 border-white"></div>
        
        <h2 className="text-2xl font-bold text-dark mb-4">{title}</h2>
        <div className="bg-white p-6 rounded-xl shadow-md space-y-3">
            {children}
        </div>
    </motion.div>
);

function MyRoadmap() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    // This state would eventually be fetched from and saved to your backend
    const [goals, setGoals] = useState({
        phase1: [
            { text: 'Complete all baseline assessments', completed: true },
            { text: 'Research top 5 career matches', completed: false },
            { text: 'Take an introductory Python course', completed: false },
        ],
        phase2: [
            { text: 'Shortlist 10 potential colleges', completed: false },
            { text: 'Start preparing for entrance exams', completed: false },
            { text: 'Work on a personal project for profile building', completed: false },
        ]
    });

    const toggleGoal = (phase, index) => {
        setGoals(prevGoals => {
            const newPhaseGoals = [...prevGoals[phase]];
            newPhaseGoals[index].completed = !newPhaseGoals[index].completed;
            return { ...prevGoals, [phase]: newPhaseGoals };
        });
        // In a real app, you would make an API call here to save the updated goals
    };

    const suggestions = [
        { title: "Focus on Computer Science", description: "Your high analytical scores suggest a strong aptitude for this field.", icon: "💻" },
        { title: "Develop Communication Skills", description: "Complement your technical abilities with public speaking and writing.", icon: "🗣️" },
        { title: "Explore Data Science", description: "Check out resources on Machine Learning as a potential specialization.", icon: "📊" },
    ];

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="My Roadmap" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                        <h1 className="text-4xl font-bold text-dark">Future Planning Dashboard</h1>
                        <p className="text-gray-600 mt-2">Your personalized journey from skill building to college applications.</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* Left Column: The Timeline */}
                        <div className="lg:col-span-2 space-y-10">
                            <TimelineSection title="Phase 1: Skill & Profile Foundation" delay={0.2}>
                                {goals.phase1.map((goal, i) => <GoalCard key={i} goal={goal} onToggle={() => toggleGoal('phase1', i)} index={i} />)}
                            </TimelineSection>
                            
                            <TimelineSection title="Phase 2: College & Exam Preparation" delay={0.4}>
                                {goals.phase2.map((goal, i) => <GoalCard key={i} goal={goal} onToggle={() => toggleGoal('phase2', i)} index={i} />)}
                            </TimelineSection>
                        </div>

                        {/* Right Column: AI Suggestions */}
                        <div className="lg:sticky lg:top-8 space-y-6">
                             <h2 className="text-2xl font-bold text-dark">AI-Powered Suggestions</h2>
                             {suggestions.map((s, i) => <SuggestionCard key={i} {...s} delay={i * 0.15} />)}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MyRoadmap;