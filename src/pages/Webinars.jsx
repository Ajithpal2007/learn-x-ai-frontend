import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios'; // Import axios for making API calls

// WebinarCard component remains the same
const WebinarCard = ({ webinar, isPast = false, delay }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-6">
        <img src={webinar.image} alt={webinar.speaker} className="w-24 h-24 rounded-full object-cover" />
        <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{webinar.title}</h3>
            <p className="text-dark-text-secondary text-sm">with {webinar.speaker}</p>
            <button className={`mt-3 font-semibold py-2 px-5 rounded-lg text-sm ${isPast ? 'bg-dark-border text-dark-text' : 'bg-primary text-white hover:bg-primary-dark'}`}>
                {isPast ? 'Watch Recording' : 'Register Now'}
            </button>
        </div>
    </motion.div>
);


function Webinars() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // --- NEW LOGIC STARTS HERE ---

    // 1. Create state to hold the data fetched from the backend
    const [upcoming, setUpcoming] = useState([]);
    const [past, setPast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 2. Use useEffect to fetch data when the component loads
    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                // Get user info (including token) from local storage
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo) {
                    // Handle case where user is not logged in
                    setError('You must be logged in to view webinars.');
                    setLoading(false);
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                // 3. Make the API call to our backend endpoint
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/webinars`, config);

                // 4. Filter the data and update our state
                setUpcoming(data.filter(w => w.status === 'Upcoming'));
                setPast(data.filter(w => w.status === 'Past'));

            } catch (err) {
                setError('Failed to load webinar data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWebinars();
    }, []); // The empty array [] ensures this runs only once on component mount

    // --- NEW LOGIC ENDS HERE ---

    return (
        <div className="flex h-screen bg-dark-bg text-dark-text">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Webinars & Q&A" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <h1 className="text-4xl font-bold text-white mb-8">Live Webinars & Q&A Sessions</h1>
                    
                    {loading && <p>Loading webinars...</p>}
                    {error && <div className="bg-red-500 text-white p-4 rounded-lg">{error}</div>}

                    {!loading && !error && (
                        <div className="space-y-12">
                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-6">Upcoming Sessions</h2>
                                <div className="space-y-4">
                                    {upcoming.length > 0 ? (
                                        upcoming.map((webinar, i) => <WebinarCard key={webinar._id} webinar={webinar} delay={i * 0.1} />)
                                    ) : (
                                        <p className="text-dark-text-secondary">No upcoming webinars scheduled.</p>
                                    )}
                                </div>
                            </section>
                            <section>
                                <h2 className="text-2xl font-semibold text-white mb-6">Past Sessions</h2>
                                <div className="space-y-4">
                                     {past.length > 0 ? (
                                        past.map((webinar, i) => <WebinarCard key={webinar._id} webinar={webinar} isPast={true} delay={(i + upcoming.length) * 0.1} />)
                                     ) : (
                                        <p className="text-dark-text-secondary">No past webinars available.</p>
                                     )}
                                </div>
                            </section>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Webinars;