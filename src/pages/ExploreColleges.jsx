import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';

// The FilterInput component with the correct LIGHT THEME classes
const FilterInput = ({ value, onChange, children }) => (
    <select 
        value={value} 
        onChange={onChange} 
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
    >
        {children}
    </select>
);

function ExploreColleges() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // --- Data fetching and state logic (This part is correct) ---
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [streamFilter, setStreamFilter] = useState('');
    const [locationSearch, setLocationSearch] = useState('');

    useEffect(() => {
        const fetchColleges = async () => {
            setLoading(true);
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo) { setError('You must be logged in.'); return; }
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const url = `http://localhost:5000/api/colleges?stream=${streamFilter}&location=${locationSearch}`;
                const { data } = await axios.get(url, config);
                setColleges(data);
            } catch (err) {
                setError('Failed to load college data.');
            } finally {
                setLoading(false);
            }
        };
        fetchColleges();
    }, [streamFilter, locationSearch]);

    const handleSave = async (collegeId) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const body = { itemId: collegeId, itemType: 'college' };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users/save`, body, config);
            alert('College saved successfully!');
        } catch (err) {
            alert('Failed to save college.');
        }
    };

    // --- JSX WITH THE CORRECT LIGHT THEME STYLING ---
    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Explore Colleges" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <h1 className="text-4xl font-bold text-dark mb-4">Explore Colleges</h1>
                    <input 
                        type="text" 
                        placeholder="Search for colleges by location..." 
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg p-4 mb-10 text-dark placeholder-gray-500" 
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters with corrected styling */}
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                                <h3 className="text-xl font-semibold text-dark">Filter Colleges</h3>
                                <FilterInput value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)}>
                                    <option value="">All Streams</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Medical">Medical</option>
                                </FilterInput>
                            </div>
                        </aside>

                        {/* College Listings */}
                        <section className="lg:col-span-3 space-y-4">
                             {loading && <p>Loading colleges...</p>}
                             {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
                             {!loading && !error && colleges.length > 0 ? (
                                colleges.map((college, i) => (
                                    <motion.div key={college._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-gray-100 shadow-md rounded-xl flex items-center p-4 gap-6">
                                        <img src={college.image} alt={college.name} className="w-48 h-28 rounded-lg object-cover hidden sm:block" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-dark">{college.name}</h3>
                                            <p className="text-gray-600">{college.location}</p>
                                        </div>
                                        <button onClick={() => handleSave(college._id)} className="bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg hover:bg-green-200">Save</button>
                                        <button className="bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20">View</button>
                                    </motion.div>
                                ))
                             ) : (
                                !loading && !error && <p className="text-gray-500">No colleges found matching your criteria.</p>
                             )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ExploreColleges;