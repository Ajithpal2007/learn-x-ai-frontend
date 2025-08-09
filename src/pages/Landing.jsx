// /src/pages/Landing.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- UI Component: Feature Card ---
const FeatureCard = ({ icon, title, text, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:-translate-y-3 transition-all duration-300 border border-gray-100 hover:shadow-2xl group"
    >
        <div className="text-5xl mb-4 text-primary group-hover:text-primary-dark transition-colors duration-300">{icon}</div>
        <h3 className="text-2xl font-bold text-dark mb-3">{title}</h3>
        <p className="text-gray-600 text-lg">{text}</p>
    </motion.div>
);

// --- UI Component: How It Works Step Card ---
const StepCard = ({ number, title, description, icon, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 h-full"
    >
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-5 text-2xl font-bold ring-4 ring-primary/20">{number}</div>
        <div className="text-4xl mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </motion.div>
);

// --- UI Component: FAQ Item ---
const FaqItem = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-gray-200 last:border-b-0">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left py-5 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-300">
            <span className="text-xl font-semibold text-dark">{q}</span>
            <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="transform transition-transform duration-300 text-primary text-2xl">+</motion.span>
        </button>
        <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            className="overflow-hidden"
        >
            <p className="text-gray-600 px-4 pb-5 text-lg">{a}</p>
        </motion.div>
    </div>
);
  
function Landing() {
    const [openFaq, setOpenFaq] = useState(0);
    const [scrolled, setScrolled] = useState(false);
  
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const faqData = [
        { q: "How does the AI work?", a: "Our AI analyzes your answers from our holistic assessments (interest, aptitude, personality) and compares your unique profile against a vast database of careers to find your best matches." },
        { q: "Is this platform only for students?", a: "While our primary focus is on students from 9th grade to college, our tools and resources can also help early-career professionals seeking clarity and direction." },
        { q: "What makes this different?", a: "We combine data-driven AI with India-specific insights, a step-by-step roadmap, and skill-building resources to provide a complete, actionable guidance system." },
        { q: "Is my data safe?", a: "Absolutely. We are compliant with India's DPDPA regulations. Your data is encrypted, anonymized for analysis, and is never shared without your explicit consent." }
    ];

    return (
        <div className="bg-white text-dark font-sans overflow-x-hidden">
            {/* Animated background shapes */}
            <div className="fixed inset-0 -z-10 opacity-50"><div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div><div className="absolute top-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div><div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div></div>
            
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-4'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="font-heading text-2xl font-bold text-dark flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center font-extrabold text-lg">A</div>
                        Learn-x-AI
                    </Link>
                    <div className="hidden md:flex space-x-8"><a href="#features" className="text-dark hover:text-primary transition-colors">Features</a><a href="#how-it-works" className="text-dark hover:text-primary transition-colors">How It Works</a><a href="#faq" className="text-dark hover:text-primary transition-colors">FAQ</a></div>
                    <Link to="/login" className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-primary-dark transition-all duration-300">Get Started</Link>
                </div>
            </nav>

            <section className="relative pt-32 pb-20">
                <div className="container mx-auto px-6 text-center">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-heading text-4xl md:text-6xl font-extrabold text-dark leading-tight mb-4">Stop Guessing. <span className="text-primary">Start Knowing.</span></motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 mb-10">Harness the power of AI to discover your perfect career path. Personalized guidance for Indian students, from stream selection to college admission.</motion.p>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}><Link to="/login" className="bg-primary text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 hover:shadow-xl">Start Free Assessment</Link></motion.div>
                </div>
            </section>

            <section id="how-it-works" className="py-24 bg-light-gray">
                <div className="container mx-auto px-6">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-16">Your Path to Clarity in 4 Steps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StepCard number="1" icon="📝" title="Holistic Assessment" description="Complete our quick, comprehensive tests that analyze your personality, interests, and skills." delay={0.1}/>
                        <StepCard number="2" icon="🔍" title="AI-Powered Analysis" description="Our AI compares your unique profile against thousands of successful career paths and opportunities." delay={0.2}/>
                        <StepCard number="3" icon="🎯" title="Personalized Matches" description="Receive your top career and stream matches with detailed, easy-to-understand explanations." delay={0.3}/>
                        <StepCard number="4" icon="🚀" title="Actionable Roadmap" description="Get a step-by-step plan with curated resources, skill suggestions, and important milestones." delay={0.4}/>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-16">A Toolkit for Your Future</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard delay={0.1} icon="🎯" title="AI-Powered Assessments" text="Holistic tests that go beyond academics to analyze your personality, interests, and innate skills." />
                        <FeatureCard delay={0.2} icon="🗺️" title="Personalized Roadmap" text="An interactive, step-by-step action plan, from stream selection to exam preparation." />
                        <FeatureCard delay={0.3} icon="🇮🇳" title="India-Specific Guidance" text="Access curated databases of Indian colleges, scholarships, and localized career data." />
                    </div>
                </div>
            </section>

            <section id="faq" className="py-24 bg-light-gray">
                <div className="container mx-auto px-6">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-16">Have Questions? We Have Answers.</h2>
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 border">
                        {faqData.map((item, index) => <FaqItem key={index} {...item} isOpen={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)} />)}
                    </div>
                </div>
            </section>
            
            <footer className="bg-dark text-gray-400 py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Ready to Find Your Clarity?</h2>
                    <Link to="/login" className="bg-white text-primary font-bold text-lg px-10 py-4 rounded-xl shadow-2xl hover:bg-blue-100 transition-all transform hover:scale-105 inline-block">Take the First Step</Link>
                    <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
                        <p>© {new Date().getFullYear()} Learn-x-AI. All rights reserved.</p>
                        <div className="mt-4 sm:mt-0"><Link to="/legal" className="text-gray-400 hover:text-white mx-4">Privacy</Link><Link to="/support" className="text-gray-400 hover:text-white mx-4">Contact</Link><Link to="/parents-corner" className="text-gray-400 hover:text-white mx-4">For Parents</Link></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;