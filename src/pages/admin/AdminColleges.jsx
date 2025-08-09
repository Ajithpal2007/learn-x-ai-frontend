// /src/pages/admin/AdminColleges.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CollegeFormModal from '../../components/admin/CollegeFormModal';

function AdminColleges() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollege, setEditingCollege] = useState(null);

    const fetchColleges = async () => {
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/colleges', config);
            setColleges(data);
        } catch (err) {
            setError('Failed to fetch colleges.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (userInfo) fetchColleges(); }, [userInfo]);

    const handleDelete = async (idToDelete) => {
        if (window.confirm('Are you sure you want to delete this college?')) {
            const originalColleges = [...colleges];
            setColleges(prev => prev.filter(c => c._id !== idToDelete));
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/colleges/${idToDelete}`, config);
            } catch (err) {
                setError('Failed to delete college. Please try again.');
                setColleges(originalColleges);
            }
        }
    };
    
    const handleOpenModal = (college = null) => { setEditingCollege(college); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingCollege(null); setIsModalOpen(false); };
    const handleSave = () => { handleCloseModal(); fetchColleges(); };

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            {/* --- UI LAYOUT FIX IS HERE --- */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Admin: Manage Colleges" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-dark">College Management</h1>
                        <button onClick={() => handleOpenModal()} className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-dark shadow"> + Add College </button>
                    </div>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Name</th><th className="p-4">Location</th><th className="p-4">Stream</th><th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td></tr>
                                ) : (
                                    colleges.map(college => (
                                        <tr key={college._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 font-semibold">{college.name}</td>
                                            <td className="p-4">{college.location}</td>
                                            <td className="p-4">{college.stream}</td>
                                            <td className="p-4 flex gap-4">
                                                <button onClick={() => handleOpenModal(college)} className="text-blue-600 font-semibold hover:underline">Edit</button>
                                                <button onClick={() => handleDelete(college._id)} className="text-red-600 font-semibold hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
            {isModalOpen && <CollegeFormModal college={editingCollege} onSave={handleSave} onClose={handleCloseModal} />}
        </div>
    );
}

export default AdminColleges;