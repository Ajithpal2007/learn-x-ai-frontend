import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function AdminUsers() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/users', config);
            setUsers(data);
        } catch (error) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (userInfo?.isAdmin) fetchUsers(); }, [userInfo]);

    const handleDelete = async (idToDelete) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            // Prevent admin from deleting themselves
            if (idToDelete === userInfo._id) {
                setError("You cannot delete your own admin account.");
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`http://localhost:5000/api/users/${idToDelete}`, config);
                fetchUsers(); // Refresh the list
            } catch (error) {
                setError('Failed to delete user.');
            }
        }
    };

    const toggleAdminStatus = async (user) => {
        if (window.confirm(`Are you sure you want to change the admin status for ${user.name}?`)) {
             // Prevent admin from removing their own admin status
            if (user._id === userInfo._id) {
                setError("You cannot remove your own admin status.");
                return;
            }
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const updatedUserData = { ...user, isAdmin: !user.isAdmin };
                await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`, updatedUserData, config);
                fetchUsers(); // Refresh the list
            } catch (error) {
                setError('Failed to update user role.');
            }
        }
    };

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Admin: Manage Users" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-dark mb-6">User Management</h1>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Admin Status</th><th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="p-4 text-center">Loading users...</td></tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 font-semibold">{user.name}</td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">
                                                {user.isAdmin ? <span className="text-green-600 font-bold">Admin</span> : 'User'}
                                            </td>
                                            <td className="p-4 flex gap-4">
                                                <button onClick={() => toggleAdminStatus(user)} className="text-blue-600 font-semibold hover:underline">
                                                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                                </button>
                                                <button onClick={() => handleDelete(user._id)} className="text-red-600 font-semibold hover:underline">Delete</button>
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

export default AdminUsers;