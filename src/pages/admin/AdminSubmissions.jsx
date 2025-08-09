import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function AdminSubmissions() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/submissions', config);
            setSubmissions(data);
        } catch (err) {
            setError('Failed to fetch submissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (userInfo?.isAdmin) fetchSubmissions(); }, [userInfo]);

    const handleUpdateStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`http://localhost:5000/api/submissions/${id}`, { status }, config);
            fetchSubmissions(); // Refresh list
        } catch (err) {
            setError('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/submissions/${id}`, config);
                fetchSubmissions(); // Refresh list
            } catch (err) {
                setError('Failed to delete submission.');
            }
        }
    };
    
    const getStatusColor = (status) => {
        if (status === 'New') return 'bg-red-100 text-red-800';
        if (status === 'Contacted') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Resolved') return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Admin: Manage Submissions" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-dark mb-6">Contact & Demo Submissions</h1>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-4">From</th><th className="p-4">Type</th><th className="p-4">Message</th><th className="p-4">Status</th><th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="p-4 text-center">Loading submissions...</td></tr>
                                ) : (
                                    submissions.map(item => (
                                        <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4"><div className="font-semibold">{item.name}</div><div className="text-sm text-gray-500">{item.email}</div></td>
                                            <td className="p-4">{item.submissionType}</td>
                                            <td className="p-4 text-sm text-gray-600 max-w-sm truncate">{item.message || 'N/A'}</td>
                                            <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span></td>
                                            <td className="p-4 space-x-2">
                                                <select onChange={(e) => handleUpdateStatus(item._id, e.target.value)} value={item.status} className="p-1 border border-gray-300 rounded text-sm">
                                                    <option>New</option><option>Contacted</option><option>Resolved</option>
                                                </select>
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
        </div>
    );
}

export default AdminSubmissions;