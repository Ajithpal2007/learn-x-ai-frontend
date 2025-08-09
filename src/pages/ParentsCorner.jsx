// /src/pages/ParentsCorner.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- UI Component: Info Block Card ---
const InfoBlock = ({ icon, title, children, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex items-start gap-6"
    >
        <div className="text-4xl bg-primary/10 text-primary p-4 rounded-lg mt-1">{icon}</div>
        <div>
            <h2 className="font-heading text-2xl font-bold text-dark mb-3">{title}</h2>
            <div className="text-lg text-gray-700 space-y-4">{children}</div>
        </div>
    </motion.div>
);

function ParentsCorner() {
  return (
    <div className="bg-light-gray">
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-10">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                <Link to="/" className="font-heading text-2xl font-bold text-primary">Learn-x-AI</Link>
                <Link to="/login" className="font-bold text-primary">Login</Link>
            </div>
        </header>

        <main>
            {/* Hero Section */}
            <section className="py-24 bg-white text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.7 }} 
                    className="container mx-auto px-6"
                >
                    <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-dark">Parents' Corner</h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Your trusted guide to supporting your child's journey in the Indian education system.
                    </p>
                </motion.div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 max-w-4xl space-y-12">
                    <InfoBlock 
                        icon="🗺️" 
                        title="Understanding the Journey"
                        delay={0.1}
                    >
                        <p>The Indian education system is structured into key stages. After Class 10, the choice of a stream (Science, Commerce, or Arts) is a pivotal moment that shapes future career paths. Our platform provides clear guides on what each stream entails and the opportunities it unlocks, demystifying the process for both you and your child.</p>
                    </InfoBlock>

                    <InfoBlock 
                        icon="🤝" 
                        title="How You Can Help"
                        delay={0.2}
                    >
                        <p>Your role as a supportive guide is vital. We encourage you to facilitate open discussions and explore options together with your child. Use our platform's tools to help them assess their unique interests and strengths, creating a positive environment for them to make informed decisions without pressure.</p>
                    </InfoBlock>
                    
                    <InfoBlock 
                        icon="🛠️" 
                        title="Tools for Parents"
                        delay={0.3}
                    >
                        <p>Learn-x-AI offers resources tailored for you. With our (optional and secure) Parent Dashboard, you can understand your child's assessment results, view their recommended career paths, and access our curated databases of colleges and scholarships to plan ahead together.</p>
                        <Link to="/login" className="inline-block mt-4 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                            Explore Platform Tools
                        </Link>
                    </InfoBlock>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-primary p-12 rounded-2xl shadow-xl text-white"
                    >
                        <h2 className="font-heading text-4xl font-bold mb-4">Partner in Their Success</h2>
                        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
                            Join thousands of parents who are using Learn-x-AI to help their children build a confident and clear path to a successful future.
                        </p>
                        <Link to="/login" className="bg-white text-primary font-bold text-xl px-10 py-4 rounded-xl shadow-2xl hover:bg-blue-100 transition-all transform hover:scale-105 inline-block">
                            Get Started for Free
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    </div>
  );
}

export default ParentsCorner;