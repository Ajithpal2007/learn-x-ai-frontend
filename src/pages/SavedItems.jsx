// /src/pages/SavedItems.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- UI Component: Saved Item Card ---
const SavedItemCard = ({ item, itemType, onUnsave }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-1.5 transition-transform duration-300 border border-gray-100 flex flex-col"
    >
        <div className="overflow-hidden h-40">
            <img 
                src={item.image || item.img || 'https://i.imgur.com/gT3h3n3.png'} 
                alt={item.name || item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-dark flex-grow">{item.name || item.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{item.location || item.category}</p>
            <div className="flex items-center gap-2 mt-4">
                <button className="w-full bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors">View</button>
                <button 
                    onClick={() => onUnsave(item._id, itemType)} 
                    className="flex-shrink-0 bg-gray-100 text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                    Unsave
                </button>
            </div>
        </div>
    </motion.div>
);

const itemTypes = ['Colleges', 'Careers', 'Resources'];

function SavedItems() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [savedItems, setSavedItems] = useState({ colleges: [], careers: [], resources: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Colleges');

    const fetchSavedItems = async () => {
        if (!userInfo) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/users/saved', config);
            setSavedItems({
                colleges: data.colleges || [],
                careers: data.careers || [],
                resources: data.resources || [],
            });
        } catch (err) {
            setError('Failed to load saved items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedItems();
    }, [userInfo]);

    const handleUnsave = async (itemId, itemType) => {
        setError('');
        try {
            const config = { 
                headers: { Authorization: `Bearer ${userInfo.token}` },
                data: { itemId, itemType } 
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/save`, config);
            // Refresh the list after unsaving
            fetchSavedItems();
        } catch (err) {
            setError('Failed to unsave item.');
        }
    };

    const currentItems = savedItems[activeTab.toLowerCase()] || [];

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="My Saved Items" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-dark mb-2">My Library</h1>
                        <p className="text-gray-600 mb-8">Your personal collection of saved colleges, careers, and resources.</p>
                    </motion.div>

                    <div className="flex border-b border-gray-200 mb-8">
                        {itemTypes.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-semibold relative transition-colors ${activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
                                {tab}
                                {activeTab === tab && <motion.div layoutId="active-saved-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading your library...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <AnimatePresence>
                                {currentItems.length > 0 ? (
                                    currentItems.map(item => (
                                        <SavedItemCard 
                                            key={item._id} 
                                            item={item} 
                                            itemType={activeTab.slice(0, -1).toLowerCase()} 
                                            onUnsave={handleUnsave}
                                        />
                                    ))
                                ) : (
                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="col-span-full text-center py-16">
                                        <p className="text-xl font-semibold text-gray-700">No {activeTab} Saved Yet</p>
                                        <p className="text-gray-500 mt-2">Start exploring and save items to see them here!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default SavedItems;