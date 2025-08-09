// /src/pages/admin/AdminScholarships.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ScholarshipFormModal from '../../components/admin/ScholarshipFormModal';

function AdminScholarships() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState(null);

    // --- FUNCTIONALITY FIX: Full fetch implementation ---
    const fetchScholarships = async () => {
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/scholarships', config);
            setScholarships(data);
        } catch (error) {
            setError('Failed to fetch scholarships.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { if(userInfo) fetchScholarships(); }, [userInfo]);

    // --- FUNCTIONALITY FIX: Full delete implementation ---
    const handleDelete = async (idToDelete) => {
        if (window.confirm('Are you sure you want to delete this scholarship?')) {
            const originalScholarships = [...scholarships];
            setScholarships(prev => prev.filter(s => s._id !== idToDelete));
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/scholarships/${idToDelete}`, config);
            } catch (error) {
                setError('Failed to delete scholarship. Please try again.');
                setScholarships(originalScholarships);
            }
        }
    };
    
    const handleOpenModal = (scholarship = null) => { setEditingScholarship(scholarship); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingScholarship(null); setIsModalOpen(false); };
    const handleSave = () => { handleCloseModal(); fetchScholarships(); };

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            {/* --- UI LAYOUT FIX IS HERE --- */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Admin: Manage Scholarships" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-dark">Scholarship Management</h1>
                        <button onClick={() => handleOpenModal()} className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-dark shadow"> + Add Scholarship </button>
                    </div>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Name</th><th className="p-4">Provider</th><th className="p-4">Amount</th><th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td></tr>
                                ) : (
                                    scholarships.map(item => (
                                        <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 font-semibold">{item.name}</td>
                                            <td className="p-4">{item.provider}</td>
                                            <td className="p-4">{item.amount}</td>
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
            {isModalOpen && <ScholarshipFormModal scholarship={editingScholarship} onSave={handleSave} onClose={handleCloseModal} />}
        </div>
    );
}

export default AdminScholarships;