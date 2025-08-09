// /src/pages/ProfileGuidance.jsx

import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';

// --- UI Component: Reusable Input/Textarea ---
const ProfileInput = ({ label, name, value, onChange, placeholder, isTextarea = false }) => (
  <div>
    <label htmlFor={name} className="text-sm font-semibold text-dark-text-secondary pb-2 block">{label}</label>
    {isTextarea ? (
      <textarea
        id={name} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full min-h-32 resize-none rounded-xl text-dark-text focus:ring-2 focus:ring-primary border border-dark-border bg-dark-card placeholder:text-dark-text-secondary p-4 transition-colors"
      />
    ) : (
      <input
        id={name} name={name} type="text" value={value} onChange={onChange} placeholder={placeholder}
        className="w-full h-14 rounded-xl text-dark-text focus:ring-2 focus:ring-primary border border-dark-border bg-dark-card placeholder:text-dark-text-secondary p-4 transition-colors"
      />
    )}
  </div>
);

// --- UI Component: AI Feedback Card ---
const FeedbackCard = ({ icon, title, text, delay }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="bg-dark-card border border-dark-border rounded-xl p-5 flex items-start gap-4"
    >
        <div className="text-2xl mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-dark-text-secondary text-sm">{text}</p>
        </div>
    </motion.div>
);

function ProfileGuidance() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const [profileData, setProfileData] = useState({
    academicPerformance: '',
    extracurriculars: '',
    projects: '',
    skills: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Dynamically calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    const fields = Object.values(profileData);
    const filledFields = fields.filter(value => value.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }, [profileData]);

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <Header title="AI Profile Guidance" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-white text-4xl font-bold">AI Profile Builder</h1>
                <p className="text-dark-text-secondary mt-2">Input your details below and our AI will provide personalized feedback to enhance your profile.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8 items-start">
                {/* Left Column: Input Form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3 bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
                    <ProfileInput label="Academic Performance" name="academicPerformance" value={profileData.academicPerformance} onChange={handleInputChange} placeholder="e.g., 9.2 CGPA, 95% in Mathematics, Olympiad Rank..." />
                    <ProfileInput label="Extracurricular Activities" name="extracurriculars" value={profileData.extracurriculars} onChange={handleInputChange} placeholder="e.g., Captain of the debate team, Member of the robotics club..." isTextarea />
                    <ProfileInput label="Personal Projects" name="projects" value={profileData.projects} onChange={handleInputChange} placeholder="e.g., Built a weather monitoring app, Wrote a research paper on..." isTextarea />
                    <ProfileInput label="Skills & Competencies" name="skills" value={profileData.skills} onChange={handleInputChange} placeholder="e.g., Python, Public Speaking, Video Editing..." isTextarea />
                </motion.div>

                {/* Right Column: AI Feedback & Progress */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 lg:sticky lg:top-8 space-y-6">
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Profile Strength</h3>
                        <div className="w-full bg-dark-border rounded-full h-4 mb-2">
                            <motion.div 
                                className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full" 
                                initial={{ width: '0%' }}
                                animate={{ width: `${profileCompletion}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <p className="text-dark-text-secondary text-right font-semibold">{profileCompletion}% Complete</p>
                    </div>

                    <h3 className="text-xl font-bold text-white pt-4">AI Recommendations</h3>
                    <div className="space-y-4">
                        <FeedbackCard icon="👍" title="Highlight Your Strengths" text="Your academic performance is excellent. Make sure to feature your Olympiad rank prominently in your applications." delay={0.3} />
                        <FeedbackCard icon="💡" title="Quantify Your Impact" text="In your extracurriculars, use numbers. Instead of 'Captain of the team', say 'Led a team of 15 students to win the state championship.'" delay={0.4} />
                        <FeedbackCard icon="🔗" title="Connect Skills to Projects" text="Your Python skill is valuable. Link it directly to the weather app project to showcase practical application." delay={0.5} />
                    </div>
                </motion.div>
            </div>
        </main>
      </div>
    </div>
  );
}

export default ProfileGuidance;