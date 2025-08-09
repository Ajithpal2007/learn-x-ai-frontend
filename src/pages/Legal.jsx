// /src/pages/Legal.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- UI Component: Legal Section ---
// A simple component to structure the content and add animation.
const LegalSection = ({ title, children, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="mb-8"
    >
        <h2 className="text-2xl font-bold text-dark mb-3">{title}</h2>
        <div className="text-lg text-gray-700 space-y-4">{children}</div>
    </motion.div>
);


export default function Legal() {
    return (
        <div className="bg-light-gray min-h-screen">
             <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="font-heading text-2xl font-bold text-primary">Learn-x-AI</Link>
                    <Link to="/login" className="font-bold text-primary">Login</Link>
                </div>
            </header>

            <main className="py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-dark">Legal & Compliance</h1>
                        <p className="mt-2 text-lg text-gray-500">Last Updated: August 08, 2025</p>
                    </motion.div>
                    
                    <div className="mt-12 bg-white p-8 md:p-12 rounded-2xl shadow-xl border">
                        <LegalSection title="1. Introduction & Privacy Policy" delay={0.1}>
                            <p>Welcome to Learn-x-AI. We are committed to protecting your personal data and respecting your privacy. This policy outlines how we collect, use, and safeguard your information in compliance with India's Digital Personal Data Protection Act (DPDPA), 2023.</p>
                        </LegalSection>

                        <LegalSection title="2. Information We Collect" delay={0.2}>
                            <p>To provide our services, we collect the following types of information:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>**Personal Information:** Your name, email address, and contact details provided during registration.</li>
                                <li>**Educational Information:** Your grade, school, and academic interests to personalize your experience.</li>
                                <li>**Assessment Data:** The results from the aptitude, interest, and personality tests you take on our platform.</li>
                                <li>**Usage Data:** Information on how you interact with our application to help us improve our services.</li>
                            </ul>
                        </LegalSection>

                        <LegalSection title="3. How We Use Your Information" delay={0.3}>
                            <p>Your data is used to power the core features of our platform, including generating personalized career recommendations, creating your roadmap, and suggesting relevant resources. We do not sell your personal data to third parties.</p>
                        </LegalSection>

                        <LegalSection title="4. Your Rights Under DPDPA" delay={0.4}>
                            <p>As a user, you have the right to access, correct, and request the erasure of your personal data. We will obtain clear and informed consent before processing your information and will only use it for the stated purposes. For users under the age of 18, verifiable parental consent is required.</p>
                        </LegalSection>

                        <LegalSection title="5. Terms of Service" delay={0.5}>
                            <p>By using Learn-x-AI, you agree to use our platform for its intended educational purpose. You agree not to misuse the platform or its content. We reserve the right to suspend accounts that violate our terms. Our AI-powered guidance is intended for informational purposes and should be used as one of several resources in making your final career decisions.</p>
                        </LegalSection>
                    </div>
                </div>
            </main>
        </div>
    );
}