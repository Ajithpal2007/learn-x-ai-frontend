// /src/pages/ForSchools.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// --- UI Component: Step Card ---
const StepCard = ({ number, title, description, icon, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 h-full"
    >
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-5 text-2xl font-bold">{number}</div>
        <div className="text-4xl mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </motion.div>
);

// --- UI Component: Feature Card ---
const FeatureCard = ({ title, text, icon, delay }) => (
     <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4 border"
    >
        <div className="text-3xl bg-primary/10 text-primary p-3 rounded-lg mt-1">{icon}</div>
        <div>
            <h3 className="text-xl font-bold text-dark">{title}</h3>
            <p className="text-gray-600 mt-1">{text}</p>
        </div>
    </motion.div>
);

function ForSchools() {
    const [formData, setFormData] = useState({ name: '', role: '', schoolName: '', email: '', message: '' });
    const [status, setStatus] = useState(''); // Tracks form submission status

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');
        try {
            const body = { ...formData, submissionType: 'Demo Request' };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/submissions`, body);
            setStatus(data.message);
            // Clear form on success
            setFormData({ name: '', role: '', schoolName: '', email: '', message: '' }); 
        } catch (err) {
            setStatus('Submission failed. Please try again.');
        }
    };

    return (
        <div className="bg-light-gray">
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="font-heading text-2xl font-bold text-primary">Learn-x-AI</Link>
                    <Link to="/login" className="font-bold text-primary">Student Login</Link>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="py-24 md:py-32 text-center bg-white">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="container mx-auto px-6">
                        <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-dark">Empower Your Students for the Future</h1>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Partner with Learn-x-AI to provide your students with a data-driven, personalized career guidance platform.
                        </p>
                        <motion.a href="#demo" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-8 inline-block bg-primary text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1">
                            Request a Free Demo
                        </motion.a>
                    </motion.div>
                </section>
                
                {/* How It Works Section */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <h2 className="font-heading text-4xl font-bold text-center mb-16">A Holistic Guidance System</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <StepCard number="1" icon="🧑‍🎓" title="Empower Students" description="Students take holistic assessments to discover their strengths and receive personalized career matches." delay={0.1}/>
                            <StepCard number="2" icon="👨‍🏫" title="Support Counselors" description="Our Counselor Dashboard provides actionable insights, saving time and enhancing guidance sessions." delay={0.2}/>
                            <StepCard number="3" icon="📈" title="Track Progress" description="Monitor student engagement and progress at a cohort level with our analytics and reporting tools." delay={0.3}/>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-5xl">
                         <h2 className="font-heading text-4xl font-bold text-center mb-16">Features for Institutions</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FeatureCard icon="📊" title="Counselor Dashboard" text="A central hub to view student assessment results, progress, and career interests." delay={0.1} />
                            <FeatureCard icon="🚀" title="Bulk Student Onboarding" text="Easily enroll entire classes or grades onto the platform with simple import tools." delay={0.2} />
                            <FeatureCard icon="📈" title="Analytics & Reporting" text="Gain insights into the career aspirations and skill gaps of your student cohort." delay={0.3} />
                            <FeatureCard icon="🤝" title="Dedicated Support" text="Receive dedicated training and support for your counselors and staff to maximize impact." delay={0.4} />
                         </div>
                    </div>
                </section>

                {/* Demo Request Form Section */}
                <section id="demo" className="py-24">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="font-heading text-4xl font-bold text-center mb-12">Request a Demo</h2>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="bg-white p-8 rounded-xl shadow-2xl border">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                                    <input type="text" name="role" placeholder="Your Role (e.g., Principal)" value={formData.role} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                                </div>
                                <input type="text" name="schoolName" placeholder="School Name" value={formData.schoolName} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                                <input type="email" name="email" placeholder="Work Email Address" value={formData.email} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                                <textarea name="message" placeholder="Your Message (Optional)" value={formData.message} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg h-24" />
                                <button type="submit" disabled={status === 'Submitting...'} className="w-full bg-secondary text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400">
                                    {status === 'Submitting...' ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </form>
                            {status && status !== 'Submitting...' && <p className="text-center mt-4 text-secondary font-semibold">{status}</p>}
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ForSchools;