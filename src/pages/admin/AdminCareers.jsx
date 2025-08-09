// /src/pages/admin/AdminWebinars.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import WebinarFormModal from '../../components/admin/WebinarFormModal';

function AdminWebinars() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWebinar, setEditingWebinar] = useState(null);

    // --- FULLY IMPLEMENTED FETCH FUNCTION ---
    const fetchWebinars = async () => {
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/webinars', config);
            setWebinars(data);
        } catch (err) {
            setError('Failed to fetch webinars.');
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { if(userInfo) fetchWebinars(); }, [userInfo]);

    // --- FULLY IMPLEMENTED DELETE FUNCTION ---
    const handleDelete = async (idToDelete) => {
        if (window.confirm('Are you sure you want to delete this webinar?')) {
            const originalWebinars = [...webinars];
            setWebinars(prev => prev.filter(w => w._id !== idToDelete));
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/webinars/${idToDelete}`, config);
            } catch (err) {
                setError('Failed to delete webinar. Please try again.');
                setWebinars(originalWebinars); // Revert UI on failure
                console.error("Delete Error:", err);
            }
        }
    };
    
    const handleOpenModal = (webinar = null) => { setEditingWebinar(webinar); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingWebinar(null); setIsModalOpen(false); };
    const handleSave = () => { handleCloseModal(); fetchWebinars(); };

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            {/* --- UI LAYOUT FIX IS HERE --- */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Admin: Manage Webinars" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-dark">Webinar Management</h1>
                        <button onClick={() => handleOpenModal()} className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-dark shadow"> + Add Webinar </button>
                    </div>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Title</th>
                                    <th className="p-4 font-semibold text-gray-600">Speaker</th>
                                    <th className="p-4 font-semibold text-gray-600">Status</th>
                                    <th className="p-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td></tr>
                                ) : (
                                    webinars.map(item => (
                                        <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 font-semibold">{item.title}</td>
                                            <td className="p-4">{item.speaker}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>{item.status}</span>
                                            </td>
                                            <td className="p-4 flex gap-4">
                                                <button onClick={() => handleOpenModal(item)} className="text-blue-600 font-semibold hover:underline">Edit</button>
                                                <button onClick={() => handleDelete(item._id)} className="text-red-600 font-semibold hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
            {isModalOpen && <WebinarFormModal webinar={editingWebinar} onSave={handleSave} onClose={handleCloseModal} />}
        </div>
    );
}

export default AdminWebinars;