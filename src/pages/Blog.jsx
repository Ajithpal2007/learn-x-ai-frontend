// /src/pages/Blog.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// We will add axios back in the next step, for now we use local data to ensure no errors.

// --- Local Data Source ---
// This guarantees the page works without any backend issues.
const blogPostsData = [
  { _id: '1', title: '5 Common Mistakes to Avoid During JEE Preparation', category: 'Exam Prep', excerpt: 'Discover the key pitfalls that students encounter and learn how to navigate them for a better rank.', image: 'https://i.imgur.com/gT3h3n3.png' },
  { _id: '2', title: 'The Rise of AI: Top 5 Careers in Artificial Intelligence', category: 'Career Advice', excerpt: 'AI is transforming industries. We explore the most promising career paths for the next decade.', image: 'https://i.imgur.com/O1x4d1g.png' },
  { _id: '3', title: 'How to Choose the Right Stream After 10th Grade', category: 'Guidance', excerpt: 'A comprehensive guide to help you understand the Science, Commerce, and Arts streams.', image: 'https://i.imgur.com/9aW7s2T.png' },
  { _id: '4', title: 'A Day in the Life of a UX Designer', category: 'Career Advice', excerpt: 'Ever wondered what a UX Designer actually does? We follow a professional through their typical workday.', image: 'https://i.imgur.com/k2s2D6C.png' },
  { _id: '5', title: 'Mastering Time Management for Board Exams', category: 'Exam Prep', excerpt: 'Learn effective strategies to manage your study schedule, reduce stress, and maximize your performance.', image: 'https://i.imgur.com/7gX8V2c.png' },
  { _id: '6', title: 'Why Liberal Arts is a Great Choice for the Future', category: 'Guidance', excerpt: 'Explore how a Humanities education develops critical thinking and adaptability for modern careers.', image: 'https://i.imgur.com/L3b0Y4a.png' },
];

const categories = ['All', 'Exam Prep', 'Career Advice', 'Guidance'];

// --- UI Component: BlogPostCard ---
const BlogPostCard = ({ post }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100 flex flex-col"
    >
        <div className="overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <p className="text-sm font-bold text-primary mb-2">{post.category}</p>
            <h3 className="font-heading text-xl font-bold text-dark mb-3 leading-tight flex-grow">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
            {/* This link will be used later when we build the single post page */}
            <Link to={`/blog/${post._id}`} className="font-semibold text-primary hover:underline mt-auto">Read More →</Link>
        </div>
    </motion.div>
);

function Blog() {
    const [activeCategory, setActiveCategory] = useState('All');
    
    // The filtering logic now correctly uses the local data array.
    const filteredPosts = activeCategory === 'All' 
        ? blogPostsData 
        : blogPostsData.filter(p => p.category === activeCategory);

    return (
        <div className="bg-light-gray min-h-screen">
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="font-heading text-2xl font-bold text-primary">Learn-x-AI</Link>
                    <Link to="/login" className="font-bold bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors">Get Started</Link>
                </div>
            </header>
            
            <main>
                <section className="py-20 text-center">
                    <div className="container mx-auto px-6">
                        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-6xl font-extrabold text-dark">Insights & Articles</motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-gray-600">Your guide to navigating the world of education and careers.</motion.p>
                    </div>
                </section>

                <section className="pb-24">
                    <div className="container mx-auto px-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center flex-wrap gap-2 mb-12 bg-white p-2 rounded-xl shadow-md max-w-lg mx-auto">
                            {categories.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setActiveCategory(cat)} 
                                    className={`px-5 py-2 font-semibold rounded-lg text-sm relative transition-colors ${activeCategory === cat ? 'text-white' : 'text-gray-700 hover:text-primary'}`}
                                >
                                    {activeCategory === cat && (
                                        <motion.div layoutId="active-blog-category" className="absolute inset-0 bg-primary rounded-lg z-0" />
                                    )}
                                    <span className="relative z-10">{cat}</span>
                                </button>
                            ))}
                        </motion.div>
                        
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {filteredPosts.map(post => <BlogPostCard key={post._id} post={post} />)}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Blog;