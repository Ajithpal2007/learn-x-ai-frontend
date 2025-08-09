import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- MOCK DATA for Streams ---
const streamsData = [
  { id: 1, name: 'Science (PCM)', icon: '🔬', desc: 'Focuses on non-medical sciences, mathematics, and technology.', subjects: ['Physics', 'Chemistry', 'Mathematics'], careers: ['Software Engineer', 'Data Scientist'], exams: 'JEE Main & Advanced, BITSAT' },
  { id: 2, name: 'Science (PCB)', icon: '🩺', desc: 'Prepares for careers in medicine, research, and life sciences.', subjects: ['Physics', 'Chemistry', 'Biology'], careers: ['Doctor', 'Pharmacist'], exams: 'NEET, AIIMS' },
  { id: 3, name: 'Commerce', icon: '💼', desc: 'Builds a foundation in business, finance, and economics.', subjects: ['Accountancy', 'Business Studies', 'Economics'], careers: ['Chartered Accountant', 'Investment Banker'], exams: 'CUET, CA Foundation' },
  { id: 4, name: 'Arts / Humanities', icon: '🎨', desc: 'Explores history, languages, psychology, and social sciences.', subjects: ['History', 'Political Science', 'Psychology'], careers: ['Journalist', 'Civil Servant (IAS)'], exams: 'CUET, TISSNET' }
];

// --- Redesigned UI Component: ListItem (Light Theme) ---
const ListItem = ({ item, onSelect, isSelected }) => (
    <motion.div
        onClick={onSelect}
        className={`p-4 rounded-xl cursor-pointer transition-colors relative border-2 ${isSelected ? 'bg-primary/10 border-primary' : 'bg-white border-transparent hover:bg-gray-50'}`}
        whileTap={{ scale: 0.98 }}
    >
        <h3 className="font-bold text-dark flex items-center gap-3">
            <span className="text-2xl">{item.icon || '💼'}</span>
            {item.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 pl-10">{item.desc || item.cluster}</p>
        {isSelected && <motion.div layoutId="active-item-indicator-hub" className="absolute top-4 right-4 h-3 w-3 bg-primary rounded-full" />}
    </motion.div>
);

// --- Redesigned UI Component: DetailView (Light Theme) ---
const DetailView = ({ item, type }) => {
    const DetailSection = ({ title, children }) => (
        <div className="py-4 border-b border-gray-200 last:border-b-0">
            <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">{title}</h4>
            <div className="text-gray-700 leading-relaxed">{children}</div>
        </div>
    );
    return (
        <motion.div
            key={item._id || item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.3, ease: 'easeIn' } }}
            className="bg-white p-8 rounded-2xl shadow-lg"
        >
            <h2 className="text-3xl font-bold text-dark mb-2">{item.name}</h2>
            <p className="text-lg text-gray-600 mb-6">{item.desc || item.rationale}</p>
            {type === 'stream' ? (
                <>
                    <DetailSection title="Core Subjects"><div className="flex flex-wrap gap-2">{item.subjects.map(s => <span key={s} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{s}</span>)}</div></DetailSection>
                    <DetailSection title="Top Career Pathways"><div className="flex flex-wrap gap-2">{item.careers.map(c => <span key={c} className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">{c}</span>)}</div></DetailSection>
                    <DetailSection title="Key Entrance Exams"><p className="font-semibold text-dark">{item.exams}</p></DetailSection>
                </>
            ) : (
                <>
                    <DetailSection title="Key Skills"><div className="flex flex-wrap gap-2">{item.traits.map(t => <span key={t} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{t}</span>)}</div></DetailSection>
                    <DetailSection title="Industry Growth"><p className={`font-semibold text-lg ${item.growth === 'High' ? 'text-green-600' : 'text-yellow-600'}`}>{item.growth}</p></DetailSection>
                    <DetailSection title="Average Salary (India)"><p className="font-semibold text-lg text-secondary">{item.salary} LPA</p></DetailSection>
                </>
            )}
        </motion.div>
    );
};

function ExplorationHub() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [currentTab, setCurrentTab] = useState('streams');
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(streamsData[0]);

    useEffect(() => {
        const fetchCareers = async () => {
            if (!userInfo) return;
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/careers`, config);
                setCareers(data);
                // If the current tab is careers when data arrives, select the first one.
                if (currentTab === 'careers' && data.length > 0) {
                    setSelectedItem(data[0]);
                }
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchCareers();
    }, [userInfo]);

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        // Set default selection when tab changes
        if (tab === 'streams') {
            setSelectedItem(streamsData[0]);
        } else if (careers.length > 0) {
            setSelectedItem(careers[0]);
        } else {
            setSelectedItem(null); // No careers loaded yet
        }
    };
    
    const listData = currentTab === 'streams' ? streamsData : careers;

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Exploration Hub" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
                    {/* Left Column: List */}
                    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button onClick={() => handleTabChange('streams')} className={`w-1/2 py-2 font-semibold rounded-md transition-colors text-sm ${currentTab === 'streams' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Explore Streams</button>
                                <button onClick={() => handleTabChange('careers')} className={`w-1/2 py-2 font-semibold rounded-md transition-colors text-sm ${currentTab === 'careers' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Explore Careers</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {loading && currentTab === 'careers' ? <p className="text-center text-gray-500">Loading Careers...</p> : listData.map(item => (
                                <ListItem key={item._id || item.id} item={item} onSelect={() => setSelectedItem(item)} isSelected={selectedItem?._id === item._id || selectedItem?.id === item.id} />
                            ))}
                        </div>
                    </div>
                    
                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 overflow-y-auto p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            {selectedItem ? <DetailView item={selectedItem} type={currentTab === 'streams' ? 'stream' : 'career'} /> : <p className="text-center text-gray-500">Select an item to view details.</p>}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ExplorationHub;