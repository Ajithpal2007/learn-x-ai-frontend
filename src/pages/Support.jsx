// /src/pages/Support.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// --- UI Component: Support Card ---
const SupportCard = ({ icon, title, text, link, linkText, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100 h-full flex flex-col"
    >
        <div className="text-5xl mb-4 text-primary mx-auto">{icon}</div>
        <h3 className="text-2xl font-bold text-dark mb-3">{title}</h3>
        <p className="text-gray-600 flex-grow">{text}</p>
        <a href={link} className="mt-6 font-semibold text-primary hover:underline">{linkText} →</a>
    </motion.div>
);


export default function Support() {
    // --- State for the form ---
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            const body = { ...formData, submissionType: 'Contact Request' };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/submissions`, body);
            setStatus(data.message);
            setFormData({ name: '', email: '', message: '' }); // Clear form on success
        } catch (err) {
            setStatus('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-light-gray min-h-screen">
             <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="font-heading text-2xl font-bold text-primary">Learn-x-AI</Link>
                    <Link to="/login" className="font-bold text-primary">Login</Link>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="py-24 bg-white">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="container mx-auto px-6 text-center">
                        <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-dark">We're Here to Help</h1>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Have questions? Fill out the form below, or explore our other resources to find the answers you need.
                        </p>
                    </motion.div>
                </section>

                {/* Support Options Section */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <SupportCard 
                                icon="✉️"
                                title="Email Us Directly"
                                text="For specific inquiries, you can reach our support team directly via email. We aim to respond within 24 hours."
                                link="mailto:support@learnx.ai"
                                linkText="support@learnx.ai"
                                delay={0.1}
                            />
                             <SupportCard 
                                icon="📚"
                                title="Read Our FAQs"
                                text="Find quick answers to common questions about our platform, assessments, and features in our frequently asked questions section."
                                link="/#faq" // Links to the FAQ on the landing page
                                linkText="Go to FAQ"
                                delay={0.2}
                            />
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section id="contact-form" className="py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="font-heading text-4xl font-bold text-center mb-12">Send Us a Message</h2>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="bg-white p-8 rounded-xl shadow-2xl border">
                             <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                                    <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                                </div>
                                <textarea placeholder="Your Message" name="message" value={formData.message} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg h-32" required />
                                <button type="submit" disabled={status === 'Sending...'} className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                                    {status === 'Sending...' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                            {status && status !== 'Sending...' && (
                                <p className={`text-center mt-4 font-semibold ${status.includes('error') ? 'text-red-500' : 'text-green-600'}`}>
                                    {status}
                                </p>
                            )}
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}