// /src/pages/AboutUs.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- UI Component: Team Member Card ---
const TeamMemberCard = ({ name, title, imageUrl, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-center bg-white p-6 rounded-xl shadow-md border border-gray-100"
    >
        <img className="w-32 h-32 rounded-full mx-auto shadow-lg mb-4 border-4 border-white" src={imageUrl} alt={name} />
        <h4 className="font-heading text-xl font-bold text-dark">{name}</h4>
        <p className="text-primary mb-4">{title}</p>
        <div className="flex justify-center gap-4 text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
        </div>
    </motion.div>
);

// --- UI Component: Value Proposition Card ---
const ValueCard = ({ icon, title, text, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100"
    >
        <div className="text-5xl mb-4 text-primary">{icon}</div>
        <h3 className="text-2xl font-bold text-dark mb-3">{title}</h3>
        <p className="text-gray-600">{text}</p>
    </motion.div>
);

function AboutUs() {
  return (
    <div className="bg-light-gray">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
            <Link to="/" className="font-heading text-2xl font-bold text-primary">Learn-x-AI</Link>
            <Link to="/login" className="font-bold bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors">Get Started</Link>
        </div>
      </header>

      <main>
        {/* Our Mission Section */}
        <section className="py-24 md:py-32 text-center bg-white">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.7 }} 
                className="container mx-auto px-6"
            >
                <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-dark">Our Mission</h1>
                <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                    To empower every student in India with personalized, data-driven guidance to discover and pursue their most fulfilling career path.
                </p>
            </motion.div>
        </section>

        {/* Our Story Section */}
        <section className="py-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <h2 className="font-heading text-4xl font-bold text-center mb-12">Our Story</h2>
                    <div className="text-lg text-gray-700 space-y-6 bg-white p-8 rounded-xl shadow-md border">
                        <p>
                            Founded by a team of educators, technologists, and career counselors, Learn-x-AI was born from a simple observation: millions of bright students were making life-altering career decisions based on incomplete information and societal pressure. We saw friends and family members choose paths that didn't align with their true passions, leading to frustration and unfulfilled potential.
                        </p>
                        <p>
                            We decided to change that. We believed that technology, specifically Artificial Intelligence, could provide the clarity and personalized insights that were missing. We set out to build a platform that puts the student first, using the power of AI to cut through the noise and illuminate the best path forward for each individual.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Our Values Section */}
        <section className="py-24">
            <div className="container mx-auto px-6">
                 <h2 className="font-heading text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ValueCard icon="🎯" title="Personalized" text="Our guidance is tailored to each student's unique personality, interests, and skills." delay={0.1} />
                    <ValueCard icon="📊" title="Data-Driven" text="We use advanced AI to analyze data and provide accurate, unbiased recommendations." delay={0.2} />
                    <ValueCard icon="🤝" title="Empathetic" text="We understand the pressures students face and provide a supportive, encouraging environment." delay={0.3} />
                 </div>
            </div>
        </section>

        {/* Meet the Team Section */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="font-heading text-4xl font-bold text-center mb-16">Meet the Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <TeamMemberCard name="Dr. Aarav Mehta" title="Founder & CEO" imageUrl="https://i.pravatar.cc/150?u=founder" delay={0.1} />
                    <TeamMemberCard name="Priya Sharma" title="Lead Career Counselor" imageUrl="https://i.pravatar.cc/150?u=counselor" delay={0.2} />
                    <TeamMemberCard name="Rohan Gupta" title="Head of Technology" imageUrl="https://i.pravatar.cc/150?u=techlead" delay={0.3} />
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}

export default AboutUs;