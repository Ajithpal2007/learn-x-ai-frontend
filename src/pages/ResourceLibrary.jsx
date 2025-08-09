// /src/pages/ResourceLibrary.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- UI Component: ResourceCard ---
const ResourceCard = ({ resource, onToggleSave }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border"
    >
        <div className="relative overflow-hidden h-40">
            <img src={resource.img || 'https://i.imgur.com/gT3h3n3.png'} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <button 
                onClick={() => onToggleSave(resource._id, resource.isSaved)} 
                className={`absolute top-3 right-3 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm text-gray-600 hover:text-red-500 transition-colors ${resource.isSaved ? 'text-red-500' : ''}`}
            >
                <svg className={`w-6 h-6 ${resource.isSaved ? 'fill-current' : 'fill-none stroke-current'}`} strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.586l1.318-1.268a4.5 4.5 0 016.364 6.364L12 20.586l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
            </button>
        </div>
        <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 text-xs mb-2">
                <span className="font-bold uppercase text-primary">{resource.type}</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-600">{resource.field}</span>
            </div>
            <h3 className="text-lg font-bold text-dark flex-1">{resource.title}</h3>
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="mt-4 w-full text-center bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
                {resource.type === 'Video' || resource.type === 'Webinar' ? 'Watch Now' : 'Read Now'}
            </a>
        </div>
    </motion.div>
);

function ResourceLibrary() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ type: 'All Types', field: 'All Fields' });

    const fetchResources = async () => {
        if (!userInfo) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // Fetch both resources and the user's saved items to cross-reference
            const [resourcesRes, savedRes] = await Promise.all([
                axios.get('http://localhost:5000/api/resources', config),
                axios.get('http://localhost:5000/api/users/saved', config)
            ]);
            
            const savedResourceIds = new Set(savedRes.data.resources.map(r => r._id));
            const allResources = resourcesRes.data.map(res => ({
                ...res,
                isSaved: savedResourceIds.has(res._id)
            }));
            setResources(allResources);
        } catch (err) {
            setError('Failed to load resources.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [userInfo]);

    const handleToggleSave = async (resourceId, isCurrentlySaved) => {
        try {
            const config = { 
                headers: { Authorization: `Bearer ${userInfo.token}` },
                data: { itemId: resourceId, itemType: 'resource' } 
            };
            
            // Optimistically update the UI
            setResources(prev => prev.map(r => r._id === resourceId ? { ...r, isSaved: !isCurrentlySaved } : r));

            if (isCurrentlySaved) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/save`, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/users/save`, config.data, { headers: config.headers });
            }
        } catch (err) {
            setError('Failed to update saved status.');
            // Revert UI on failure
            setResources(prev => prev.map(r => r._id === resourceId ? { ...r, isSaved: isCurrentlySaved } : r));
        }
    };

    const filteredResources = resources.filter(r => {
        return r.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
               (filters.type === 'All Types' || r.type === filters.type) &&
               (filters.field === 'All Fields' || r.field === filters.field);
    });

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Resource Library" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-dark mb-2">Resource Library</h1>
                        <p className="text-gray-600 mb-8">Your curated collection of content to explore and prepare for your future.</p>
                    </motion.div>
                    
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="md:col-span-3 w-full p-3 border border-gray-200 rounded-lg" placeholder="Search resources by title..."/>
                        <select value={filters.type} onChange={(e) => setFilters(f => ({...f, type: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <option>All Types</option><option>Article</option><option>Video</option><option>Webinar</option>
                        </select>
                        <select value={filters.field} onChange={(e) => setFilters(f => ({...f, field: e.target.value}))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <option>All Fields</option><option>Technology</option><option>Healthcare</option><option>Creative</option><option>Business</option><option>Guidance</option>
                        </select>
                        <button onClick={() => { setSearchTerm(''); setFilters({ type: 'All Types', field: 'All Fields' }); }} className="bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300">Clear</button>
                    </motion.section>
                    
                    {loading ? (
                        <p className="text-center text-gray-500">Loading resources...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                            <AnimatePresence>
                                {filteredResources.length > 0 ? (
                                    filteredResources.map((res) => <ResourceCard key={res._id} resource={res} onToggleSave={handleToggleSave} />)
                                ) : (
                                    <div className="col-span-full text-center py-16">
                                        <h3 className="text-xl font-semibold text-gray-700">No Resources Found</h3>
                                        <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ResourceLibrary;