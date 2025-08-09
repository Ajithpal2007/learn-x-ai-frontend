// /src/pages/Community.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- UI Component: Category Filter Button ---
const CategoryButton = ({ category, activeCategory, setActiveCategory }) => (
    <button
        onClick={() => setActiveCategory(category)}
        className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors text-base relative ${activeCategory === category ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
    >
        # {category}
    </button>
);

// --- UI Component: Discussion Post Card ---
const DiscussionPostCard = ({ post }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
            <img 
                src={`https://i.pravatar.cc/150?u=${post.author?._id || 'default'}`} 
                alt={post.author?.name || 'User'} 
                className="w-12 h-12 rounded-full flex-shrink-0" 
            />
            <div className="flex-1">
                <h3 className="text-lg font-bold text-dark mb-1">{post.title}</h3>
                <p className="text-sm text-gray-500">
                    Posted by <span className="font-semibold text-primary">{post.author?.name || 'Unknown User'}</span>
                    <span className="mx-2">•</span>
                    {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-gray-700 mt-3 line-clamp-3">{post.content}</p>
            </div>
        </div>
    </div>
);

function Community() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();

    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState("All Discussions");

    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('General');
    const [isFormExpanded, setIsFormExpanded] = useState(false);

    const fetchDiscussions = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const categoryFilter = activeCategory === 'All Discussions' ? '' : activeCategory;
            const { data } = await axios.get(`http://localhost:5000/api/discussions?category=${categoryFilter}`, config);
            setDiscussions(data);
        } catch (err) {
            setError('Failed to load discussions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (userInfo) fetchDiscussions(); }, [activeCategory, userInfo]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostTitle || !newPostContent) {
            alert('Please fill in both title and content.');
            return;
        }
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const body = { title: newPostTitle, content: newPostContent, category: newPostCategory };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/discussions`, body, config);
            
            setNewPostTitle('');
            setNewPostContent('');
            setIsFormExpanded(false);
            fetchDiscussions(); 
        } catch (err) {
            setError('Failed to create post. Please try again.');
        }
    };

    const feedVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Community" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-dark mb-2">Community Hub</h1>
                        <p className="text-gray-600 mb-8">Join the conversation, ask questions, and connect with peers.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        {/* Left Column: Categories */}
                        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} className="lg:col-span-1 lg:sticky lg:top-8">
                            <div className="bg-white rounded-xl shadow-md p-4 space-y-1">
                                {["All Discussions", "Science", "Commerce", "Arts", "General"].map(cat => (
                                    <CategoryButton key={cat} category={cat} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Column: Content */}
                        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
                            {/* New Discussion Form */}
                            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                                <form onSubmit={handleCreatePost}>
                                    <input 
                                        type="text" 
                                        placeholder="Start a new discussion..." 
                                        value={newPostTitle} 
                                        onChange={e => setNewPostTitle(e.target.value)} 
                                        onFocus={() => setIsFormExpanded(true)}
                                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-dark placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:outline-none transition-all" 
                                    />
                                    <AnimatePresence>
                                    {isFormExpanded && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <textarea 
                                                placeholder="Add more details..." 
                                                value={newPostContent} 
                                                onChange={e => setNewPostContent(e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-lg p-3 h-24 mt-3 text-dark placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                            ></textarea>
                                            <div className="flex justify-between items-center mt-3">
                                                <select value={newPostCategory} onChange={e => setNewPostCategory(e.target.value)} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-2 font-semibold text-dark focus:ring-2 focus:ring-primary focus:outline-none">
                                                    <option>General</option><option>Science</option><option>Commerce</option><option>Arts</option>
                                                </select>
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => {setIsFormExpanded(false); setNewPostTitle(''); setNewPostContent('');}} className="font-semibold py-2 px-5 rounded-lg hover:bg-gray-100">Cancel</button>
                                                    <button type="submit" className="flex-shrink-0 bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-dark transition-colors">Post</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </form>
                            </div>
                            
                            {/* Discussion Feed */}
                            <AnimatePresence mode="wait">
                                <motion.div key={activeCategory} variants={feedVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                    {loading && <p className="text-center text-gray-500">Loading posts...</p>}
                                    {error && <p className="text-center text-red-500">{error}</p>}
                                    {!loading && !error && discussions.map((post) => <DiscussionPostCard key={post._id} post={post} />)}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Community;